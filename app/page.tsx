"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CrawlResults } from "@/components/CrawlResults"
import { generateCrawlReport } from "@/lib/crawl-data"
import type { CrawlReport } from "@/lib/crawl-data"
import { Search, Bot, Loader2 } from "lucide-react"

export default function Home() {
  const [url, setUrl] = useState("")
  const [report, setReport] = useState<CrawlReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function isValidUrl(value: string) {
    try {
      const u = value.startsWith("http") ? value : `https://${value}`
      new URL(u)
      return true
    } catch {
      return false
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) { setError("Please enter a URL"); return }
    if (!isValidUrl(trimmed)) { setError("Please enter a valid URL"); return }

    setError("")
    setLoading(true)
    setReport(null)

    // Simulate network delay for realism
    await new Promise((r) => setTimeout(r, 1800))

    const normalized = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`
    const result = generateCrawlReport(normalized)
    setReport(result)
    setLoading(false)
  }

  const examples = ["openai.com", "github.com", "example.com"]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 mb-4 shadow-lg">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Crawlability Test</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Check if your website is ready for AI agents, crawlers, and the next generation of AI-powered search.
          </p>
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-2 bg-white rounded-xl shadow-md border border-gray-200 p-2">
            <Input
              type="text"
              placeholder="Enter a website URL (e.g. example.com)"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError("") }}
              className="border-0 shadow-none focus-visible:ring-0 text-base"
              disabled={loading}
            />
            <Button type="submit" disabled={loading} className="shrink-0 rounded-lg">
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Scanning…</>
              ) : (
                <><Search className="h-4 w-4" />Run Test</>
              )}
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2 ml-2">{error}</p>}
        </form>

        {/* Example links */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <span className="text-sm text-gray-400">Try:</span>
          {examples.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => { setUrl(ex); setError(""); setReport(null) }}
              className="text-sm text-blue-600 hover:text-blue-800 underline underline-offset-2"
            >
              {ex}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Scanning website for AI compatibility…</p>
            <p className="text-gray-400 text-sm mt-1">Checking llms.txt, robots.txt, sitemaps, structured data and more</p>
          </div>
        )}

        {/* Results */}
        {!loading && report && <CrawlResults report={report} />}

        {/* Empty state feature cards */}
        {!loading && !report && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            {[
              { icon: "📄", title: "llms.txt", desc: "Checks for the emerging AI-readable site manifest standard" },
              { icon: "🤖", title: "Robots & Sitemaps", desc: "Verifies AI bots are allowed and content is discoverable" },
              { icon: "🔍", title: "Structured Data", desc: "Looks for JSON-LD schemas that help AI understand your content" },
              { icon: "📚", title: "Knowledge Hub", desc: "Detects documentation or help sections AI can index" },
              { icon: "🔓", title: "Open Access", desc: "Ensures key content is reachable without authentication" },
              { icon: "🏷️", title: "Rich Metadata", desc: "Checks Open Graph and meta tags for AI summarization" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-semibold text-gray-800 text-sm mb-1">{item.title}</div>
                <div className="text-gray-500 text-xs">{item.desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="text-center text-xs text-gray-400 pb-8">
        Results are based on synthetic demonstration data for illustration purposes.
      </footer>
    </main>
  )
}
