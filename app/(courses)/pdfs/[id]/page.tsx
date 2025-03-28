"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { pdfApi } from "../../../../lib/api"
import { useAuth } from "../../../../contexts/AuthContext"
import { toast } from "sonner"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Download, FileText } from "lucide-react"
import { Badge } from "../../../../components/ui/badge"
import { Separator } from "../../../../components/ui/separator"
import { PaymentForm } from "../../../../components/payment-form"

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

export default function PDFDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [pdf, setPdf] = useState<PDF | null>(null)
  const [hasPurchased, setHasPurchased] = useState(false)
  const [isPurchasePending, setIsPurchasePending] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch PDF details
        const pdfResponse = await pdfApi.getById(id as string)
        setPdf(pdfResponse.data)

        // Check if user has purchased this PDF
        if (isAuthenticated && user) {
          try {
            const accessResponse = await pdfApi.checkAccess({
              pdfId: id as string,
            })

            setHasPurchased(accessResponse.data.access)
            setIsPurchasePending(accessResponse.data.pending)

            if (accessResponse.data.access) {
              setDownloadUrl(accessResponse.data.downloadUrl)
            }
          } catch (error) {
            console.error("Error checking access:", error)
            setHasPurchased(false)
            setIsPurchasePending(false)
          }
        }
      } catch (error) {
        console.error("Error fetching PDF data:", error)
        toast.error("Failed to load PDF details")
        router.push("/pdfs")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, user, isAuthenticated, router])

  const handlePurchaseSuccess = () => {
    setIsPurchasePending(true)
    toast.success("Payment submitted successfully", {
      description: "Your payment is pending approval by an administrator.",
    })
  }

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank")
      toast.success("Download started")
    } else {
      toast.error("Download link not available")
    }
  }

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!pdf) {
    return (
      <div className="container py-10">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="text-2xl font-semibold mb-2">PDF Not Found</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            The PDF you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/pdfs">
            <Button>Browse PDFs</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Link href="/pdfs">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{pdf.title}</h1>
            <p className="text-muted-foreground">
              Category: {pdf.category.name} | Subcategory: {pdf.subcategory.name}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>PDF Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold mb-2">Description</h2>
                  <p className="text-muted-foreground">{pdf.description}</p>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-2">What's Inside</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Comprehensive study materials</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Practice exercises with solutions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Reference guides and cheat sheets</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Exam preparation materials</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>File Size: {pdf.fileSize}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg">
                    <Download className="h-4 w-4 text-primary" />
                    <span>Downloads: {pdf.downloads}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg">
                    <Badge variant="outline">PDF Format</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Purchase PDF</CardTitle>
                <CardDescription>
                  {hasPurchased
                    ? "You have access to this PDF"
                    : isPurchasePending
                      ? "Your payment is pending approval"
                      : "Purchase this PDF to download it"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Price:</span>
                  <Badge className="text-lg">৳{pdf.price}</Badge>
                </div>

                {hasPurchased && (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
                      <h3 className="font-medium mb-1">Access Granted</h3>
                      <p className="text-sm">You have purchased this PDF. You can download it anytime.</p>
                    </div>
                    <Button className="w-full" onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                )}

                {isPurchasePending && (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
                      <h3 className="font-medium mb-1">Payment Pending</h3>
                      <p className="text-sm">
                        Your payment is currently being reviewed by our team. You will gain access to download the PDF
                        once your payment is approved.
                      </p>
                    </div>
                    <Button className="w-full" disabled>
                      Awaiting Approval
                    </Button>
                  </div>
                )}

                {!hasPurchased && !isPurchasePending && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Instant download after approval</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">High-quality PDF format</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Lifetime access</span>
                    </div>

                    <Separator />

                    {isAuthenticated ? (
                      <PaymentForm
                        itemId={id as string}
                        itemType="pdf"
                        itemName={pdf.title}
                        price={`৳${pdf.price}`}
                        onSuccess={handlePurchaseSuccess}
                      />
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground text-center">Please log in to purchase this PDF</p>
                        <Link href={`/login?redirect=/pdfs/${id}`}>
                          <Button className="w-full">Login to Purchase</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

