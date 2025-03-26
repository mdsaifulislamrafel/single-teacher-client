"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { useAuth } from "../../../../contexts/AuthContext"
import { userApi } from "../../../../lib/api"
import { useToast } from "../../../../components/ui/use-toast"
import Link from "next/link"
import { Download, FileText } from "lucide-react"
import { Badge } from "../../../../components/ui/badge"

interface UserPDF {
  _id: string
  item: {
    _id: string
    title: string
    description: string
    price: number
    fileUrl: string
    downloads: number
  }
  status: string
  createdAt: string
}

export default function UserPDFsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [pdfs, setPdfs] = useState<UserPDF[]>([])

  useEffect(() => {
    const fetchPDFs = async () => {
      if (!user) return

      try {
        setLoading(true)
        const response = await userApi.getPDFs(user.id)
        setPdfs(response.data)
      } catch (error) {
        console.error("Error fetching PDFs:", error)
        toast({
          title: "Error",
          description: "Failed to load your PDFs",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPDFs()
  }, [user, toast])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">My PDFs</h1>

      {pdfs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No PDFs Yet</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            You haven't purchased any PDFs yet. Browse our catalog to find PDFs that interest you.
          </p>
          <Link href="/pdfs">
            <Button>Browse PDFs</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pdfs.map((pdf) => (
            <Card key={pdf._id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{pdf.item.title}</CardTitle>
                    <CardDescription className="mt-1">Price: ৳{pdf.item.price}</CardDescription>
                  </div>
                  <Badge variant={pdf.status === "approved" ? "default" : "secondary"}>
                    {pdf.status === "approved" ? "Available" : "Pending"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">{pdf.item.description}</p>

                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Purchased: {new Date(pdf.createdAt).toLocaleDateString()}</span>
                    {pdf.status === "approved" && <span>Downloads: {pdf.item.downloads}</span>}
                  </div>

                  {pdf.status === "approved" ? (
                    <Button className="w-full" onClick={() => window.open(pdf.item.fileUrl, "_blank")}>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  ) : (
                    <Button className="w-full" disabled>
                      Awaiting Approval
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

