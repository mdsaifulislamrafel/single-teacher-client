// app/api/vimeo/upload/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const VIMEO_TOKEN = process.env.VIMEO_ACCESS_TOKEN!
  const formData = await request.formData()
  const file = formData.get('file') as File

  try {
    // Step 1: Create the video container
    const createResponse = await fetch('https://api.vimeo.com/me/videos', {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${VIMEO_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.vimeo.*+json;version=3.4'
      },
      body: JSON.stringify({
        upload: {
          approach: 'tus',
          size: file.size.toString()
        },
        name: file.name,
        description: 'Uploaded from learning platform'
      })
    })

    if (!createResponse.ok) throw new Error('Failed to create video container')
    const { upload: { upload_link } } = await createResponse.json()

    // Step 2: Upload the file using TUS protocol
    const uploadResponse = await fetch(upload_link, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/offset+octet-stream',
        'Tus-Resumable': '1.0.0',
        'Upload-Offset': '0'
      },
      body: await file.arrayBuffer()
    })

    if (!uploadResponse.ok) throw new Error('Upload failed')
    
    const videoUri = uploadResponse.headers.get('Location')!
    const vimeoId = videoUri.split('/').pop()!

    return NextResponse.json({ vimeoId })
  } catch (error) {
    console.error('Vimeo upload failed:', error)
    return NextResponse.json(
      { error: 'Video upload failed' },
      { status: 500 }
    )
  }
}