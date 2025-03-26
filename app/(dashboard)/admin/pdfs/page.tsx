"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Input } from "../../../../components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table"
import { MoreVertical, Plus, Search, Edit, Trash, FileText, Download, Eye } from "lucide-react"
import { pdfApi } from "../../../../lib/api"
import { useToast } from "../../../../components/ui/use-toast"

interface PDF {
  _id: string
  title: string
  description: string
  category: {
    _id: string
    name: string
  }
  subcategory: {
    _id: string
    name: string
  }
  price: number
  fileUrl: string
  fileSize: string
  downloads: number
  createdAt: string
}

export default function PDFsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [pdfs, setPdfs] = useState<PDF[]>([])

  useEffect(() => {
    const fetchPDFs = async () => {
      try {
        setLoading(true)
        const response = await pdfApi.getAll()
        setPdfs(response.data)
      } catch (error) {
        console.error("Error fetching PDFs:", error)
        toast({
          title: "Error",
          description: "Failed to load PDFs",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPDFs()
  }, [toast])

  const filteredPDFs = pdfs.filter(
    (pdf) =>
      pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pdf.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pdf.subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeletePDF = async (id: string) => {
    if (!confirm("Are you sure you want to delete this PDF? This action cannot be undone.")) {
      return
    }

    try {
      await pdfApi.delete(id)
      setPdfs(pdfs.filter((pdf) => pdf._id !== id))
      toast({
        title: "PDF deleted",
        description: "The PDF has been deleted successfully",
      })
    } catch (error: any) {
      console.error("Error deleting PDF:", error)
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to delete PDF",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">PDFs Management</h1>
        <Link href="/admin/pdfs/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add PDF
          </Button>
        </Link>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search PDFs..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>PDFs</CardTitle>
          <CardDescription>Manage your PDF resources.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Subcategory</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPDFs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No PDFs found. Try a different search term or add a new PDF.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPDFs.map((pdf) => (
                  <TableRow key={pdf._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                        {pdf.title}
                      </div>
                    </TableCell>
                    <TableCell>{pdf.category.name}</TableCell>
                    <TableCell>{pdf.subcategory.name}</TableCell>
                    <TableCell>{pdf.fileSize}</TableCell>
                    <TableCell>৳{pdf.price}</TableCell>
                    <TableCell>{pdf.downloads}</TableCell>
                    <TableCell>{new Date(pdf.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/admin/pdfs/${pdf._id}`}>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem onClick={() => window.open(pdf.fileUrl, "_blank")}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <Link href={`/admin/pdfs/${pdf._id}/edit`}>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeletePDF(pdf._id)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

