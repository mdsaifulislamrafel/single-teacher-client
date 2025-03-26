"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "../components/ui/button"
import { Upload, X, FileText } from "lucide-react"

interface FileUploadProps {
  onFileChange: (file: File | null) => void
  accept?: string
  maxSize?: number // in MB
}

export function FileUpload({ onFileChange, accept = "*", maxSize = 5 }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Update the handleFileChange function to provide better feedback
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null

    if (!selectedFile) {
      setFile(null)
      onFileChange(null)
      return
    }

    // Check file type if accept is specified
    if (accept !== "*") {
      const fileType = selectedFile.type
      const acceptedTypes = accept.split(",").map((type) => type.trim())

      // For PDF, we check both the extension and MIME type
      if (accept === ".pdf" && !fileType.includes("pdf") && !selectedFile.name.toLowerCase().endsWith(".pdf")) {
        setError(`Only PDF files are allowed`)
        setFile(null)
        onFileChange(null)
        return
      }

      // For other file types
      const isAccepted = acceptedTypes.some(
        (type) => fileType.includes(type.replace(".", "")) || selectedFile.name.toLowerCase().endsWith(type),
      )

      if (!isAccepted) {
        setError(`File type not accepted. Please upload ${accept} files only`)
        setFile(null)
        onFileChange(null)
        return
      }
    }

    // Check file size
    if (maxSize && selectedFile.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`)
      setFile(null)
      onFileChange(null)
      return
    }

    setError(null)
    setFile(selectedFile)
    onFileChange(selectedFile)
  }

  const handleRemoveFile = () => {
    setFile(null)
    setError(null)
    onFileChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB"
    else return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center"
          onDragOver={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          onDrop={(e) => {
            e.preventDefault()
            e.stopPropagation()

            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              const droppedFile = e.dataTransfer.files[0]

              // Create a new event-like object to pass to handleFileChange
              const mockEvent = {
                target: {
                  files: e.dataTransfer.files,
                },
              } as React.ChangeEvent<HTMLInputElement>

              handleFileChange(mockEvent)
            }
          }}
        >
          <Upload className="h-8 w-8 text-muted-foreground mb-4" />
          <div className="space-y-2">
            <p className="text-sm font-medium">Drag and drop your file here or click to browse</p>
            <p className="text-xs text-muted-foreground">
              {accept === ".pdf" ? "PDF" : accept.replace(/\./g, "").toUpperCase()} files up to {maxSize}MB
            </p>
          </div>
          <input ref={fileInputRef} type="file" className="hidden" accept={accept} onChange={handleFileChange} />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="mt-4">
            Select File
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-muted rounded-md p-2">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium text-sm">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

