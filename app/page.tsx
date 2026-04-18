"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CrawlResults } from "@/components/CrawlResults"
import { generateCrawlReport } from "@/lib/crawl-data"
import type { CrawlReport } from "@/lib/crawl-data"
import { Search, Loader2 } from "lucide-react"

const FEATURES = [
  { icon: "📄", title: "llms.txt", desc: "Checks for the emerging AI-readable site manifest that tells LLMs how to interact with the site." },
  { icon: "🤖", title: "Robots & Sitemaps", desc: "Verifies AI crawlers are explicitly allowed and all content is systematically discoverable." },
  { icon: "🔍", title: "Structured Data", desc: "Looks for JSON-LD schemas that help AI understand the meaning and context of your content." },
  { icon: "📚", title: "Knowledge Hub", desc: "Detects dedicated documentation or help sections that AI can index for accurate answers." },
  { icon: "🔓", title: "Open Access", desc: "Ensures key content is reachable without authentication so crawlers aren't blocked." },
  { icon: "🏷️", title: "Rich Metadata", desc: "Checks Open Graph and meta description tags that AI uses to summarise pages." },
]

export default function Home() {
  const [url, setUrl] = useState("")
  const [report, setReport] = useState<CrawlReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function isValidUrl(value: string) {
    try {
      new URL(value.startsWith("http") ? value : `https://${value}`)
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
    await new Promise((r) => setTimeout(r, 1800))
    const normalized = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`
    setReport(generateCrawlReport(normalized))
    setLoading(false)
  }

  const examples = ["openai.com", "github.com", "example.com"]

  return (
    <div style={{ backgroundColor: "#f5f4ed", minHeight: "100vh" }}>
      {/* Nav */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ backgroundColor: "#f5f4ed", borderBottom: "1px solid #f0eee6" }}
      >
        <span
          className="text-base font-medium tracking-tight"
          style={{ fontFamily: 'Georgia, serif', color: "#141413", fontWeight: 500 }}
        >
          AI Crawlability Test
        </span>
        <span className="text-xs" style={{ color: "#87867f" }}>
          Synthetic demo data
        </span>
      </header>

      {/* Hero */}
      <section className="max-w-2xl mx-auto px-6 pt-20 pb-12 text-center">
        <p
          className="text-xs font-medium tracking-[0.5px] uppercase mb-6"
          style={{ color: "#87867f", letterSpacing: "0.5px" }}
        >
          Free Tool
        </p>
        <h1
          className="mb-5 leading-[1.10]"
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontWeight: 500,
            fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
            color: "#141413",
            letterSpacing: "-0.01em",
          }}
        >
          Is your site ready for AI?
        </h1>
        <p
          className="text-lg leading-relaxed mb-10 max-w-lg mx-auto"
          style={{ color: "#5e5d59", lineHeight: 1.6 }}
        >
          Check how well your website can be discovered, indexed, and understood
          by AI agents, crawlers, and the new generation of AI-powered search.
        </p>

        {/* Search form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-4">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="yourwebsite.com"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError("") }}
              className="w-full h-12 text-base pl-4 pr-4"
              disabled={loading}
              style={{ fontSize: "1rem" }}
            />
          </div>
          <Button type="submit" disabled={loading} size="lg" className="h-12 shrink-0">
            {loading
              ? <><Loader2 className="h-4 w-4 animate-spin" />Scanning…</>
              : <><Search className="h-4 w-4" />Run Test</>
            }
          </Button>
        </form>

        {error && (
          <p className="text-sm mb-3" style={{ color: "#b53333" }}>{error}</p>
        )}

        {/* Example links */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
          <span className="text-sm" style={{ color: "#87867f" }}>Try an example:</span>
          {examples.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => { setUrl(ex); setError(""); setReport(null) }}
              className="text-sm underline underline-offset-2 transition-colors"
              style={{ color: "#c96442" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#a0502f")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#c96442")}
            >
              {ex}
            </button>
          ))}
        </div>
      </section>

      {/* Loading */}
      {loading && (
        <section className="max-w-2xl mx-auto px-6 pb-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: "#c96442" }} />
          <p className="font-medium" style={{ color: "#141413" }}>Scanning website for AI compatibility…</p>
          <p className="text-sm mt-1" style={{ color: "#87867f" }}>
            Checking llms.txt, robots.txt, sitemaps, structured data and more
          </p>
        </section>
      )}

      {/* Results */}
      {!loading && report && (
        <section className="max-w-2xl mx-auto px-6 pb-20">
          <CrawlResults report={report} />
        </section>
      )}

      {/* Feature grid — only when no results */}
      {!loading && !report && (
        <>
          {/* Light section — what we check */}
          <section className="max-w-2xl mx-auto px-6 pb-20">
            <h2
              className="text-center mb-8"
              style={{
                fontFamily: 'Georgia, serif',
                fontWeight: 500,
                fontSize: "1.3rem",
                color: "#141413",
                lineHeight: 1.2,
              }}
            >
              What we check
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURES.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[8px] p-5"
                  style={{
                    backgroundColor: "#faf9f5",
                    border: "1px solid #f0eee6",
                    boxShadow: "rgba(0,0,0,0.04) 0px 4px 24px",
                  }}
                >
                  <div className="text-xl mb-2">{item.icon}</div>
                  <div
                    className="font-medium mb-1"
                    style={{ fontFamily: 'Georgia, serif', fontWeight: 500, fontSize: "1rem", color: "#141413" }}
                  >
                    {item.title}
                  </div>
                  <div className="text-sm leading-relaxed" style={{ color: "#5e5d59", lineHeight: 1.6 }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Dark section — why it matters */}
          <section
            className="py-20 px-6"
            style={{ backgroundColor: "#141413" }}
          >
            <div className="max-w-2xl mx-auto text-center">
              <h2
                className="mb-5 leading-[1.20]"
                style={{
                  fontFamily: 'Georgia, serif',
                  fontWeight: 500,
                  fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                  color: "#faf9f5",
                }}
              >
                AI is the new search
              </h2>
              <p
                className="text-base leading-relaxed max-w-lg mx-auto"
                style={{ color: "#b0aea5", lineHeight: 1.6 }}
              >
                ChatGPT, Claude, Perplexity, and AI-powered browsers are rapidly replacing
                traditional search as the way people find information. If your website isn't
                structured for AI crawlers, you risk becoming invisible — even if you rank
                well on Google today.
              </p>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer
        className="text-center py-8 px-6"
        style={{ borderTop: "1px solid #f0eee6", backgroundColor: "#f5f4ed" }}
      >
        <p className="text-xs" style={{ color: "#87867f" }}>
          Results are based on synthetic demonstration data for illustration purposes only.
        </p>
      </footer>
    </div>
  )
}
