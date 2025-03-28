"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import axios from "axios"
import { toast } from "sonner"

export function ApiDebug() {
  const [url, setUrl] = useState("")
  const [method, setMethod] = useState("GET")
  const [body, setBody] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)

  const handleTest = async () => {
    if (!url) {
      toast.error("Please enter a URL")
      return
    }

    setLoading(true)
    setResponse("")

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
      const fullUrl = url.startsWith("http") ? url : `${API_URL}${url.startsWith("/") ? url : `/${url}`}`

      const token = localStorage.getItem("token")
      const headers: Record<string, string> = {}

      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      let data = {}
      if (body) {
        try {
          data = JSON.parse(body)
        } catch (e) {
          toast.error("Invalid JSON in request body")
          setLoading(false)
          return
        }
      }

      let result
      switch (method) {
        case "GET":
          result = await axios.get(fullUrl, { headers })
          break
        case "POST":
          result = await axios.post(fullUrl, data, { headers })
          break
        case "PUT":
          result = await axios.put(fullUrl, data, { headers })
          break
        case "DELETE":
          result = await axios.delete(fullUrl, { headers })
          break
        default:
          result = await axios.get(fullUrl, { headers })
      }

      setResponse(JSON.stringify(result.data, null, 2))
      toast.success("API request successful")
    } catch (error: any) {
      console.error("API test error:", error)
      setResponse(
        JSON.stringify(
          {
            error: error.message,
            response: error.response?.data,
            status: error.response?.status,
          },
          null,
          2,
        ),
      )
      toast.error(`API Error: ${error.response?.data?.message || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>API Debug Tool</CardTitle>
        <CardDescription>Test your API endpoints directly</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-1/4">
            <Label htmlFor="method">Method</Label>
            <select
              id="method"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
          <div className="flex-1">
            <Label htmlFor="url">API Endpoint</Label>
            <Input
              id="url"
              placeholder="/categories or full URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="body">Request Body (JSON)</Label>
          <Textarea
            id="body"
            placeholder={`{\n  "key": "value"\n}`}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="font-mono"
            rows={5}
            disabled={method === "GET" || method === "DELETE"}
          />
        </div>

        <div>
          <Label htmlFor="response">Response</Label>
          <Textarea id="response" value={response} readOnly className="font-mono bg-muted" rows={10} />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleTest} disabled={loading} className="w-full">
          {loading ? "Testing..." : "Test API Endpoint"}
        </Button>
      </CardFooter>
    </Card>
  )
}

