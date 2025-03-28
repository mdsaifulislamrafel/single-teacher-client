"use client"

import { ApiDebug } from "../../components/api-debug"

export default function ApiDebugPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">API Debugging</h1>
      <ApiDebug />
    </div>
  )
}

