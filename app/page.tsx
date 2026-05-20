"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { BLOG_POSTS } from "@/lib/blog"
import { getSupabase } from "@/lib/supabase"
import { CrawlResults } from "@/components/CrawlResults"
import { buildCrawlReport } from "@/lib/crawl-data"
import type { CrawlReport, CheckResult } from "@/lib/crawl-data"

const FEATURES = [
  { icon: "🤖", title: "AI discovery", desc: "Checks llms.txt, robots.txt, sitemap.xml, and per-page markdown so AI crawlers can find and access your content.", live: true },
  { icon: "📊", title: "Structured data & SEO", desc: "Verifies JSON-LD schema markup, Open Graph tags, meta titles, and canonical URLs across all pages.", live: true },
  { icon: "⚡", title: "Performance & structure", desc: "Measures server response time, compression, HTML heading structure, and internal linking.", live: true },
  { icon: "🏛️", title: "Authority & expertise", desc: "Checks Organization schema, social links, author signals, about page, and reputation indicators.", live: true },
]

const PREVIEW_COUNT = 4

export default function Home() {
  const [url, setUrl] = useState("")
  const [results, setResults] = useState<CrawlReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Gate state
  const [gateUnlocked, setGateUnlocked] = useState(false)
  const [gateName, setGateName] = useState("")
  const [gateEmail, setGateEmail] = useState("")
  const [gateLoading, setGateLoading] = useState(false)
  const [gateError, setGateError] = useState("")

  function isValidUrl(value: string) {
    try {
      new URL(value.startsWith("http") ? value : `https://${value}`)
      return true
    } catch {
      return false
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) { setError("Please enter a URL"); return }
    if (!isValidUrl(trimmed)) { setError("Please enter a valid URL"); return }

    setError("")
    setLoading(true)
    setResults(null)
    setGateUnlocked(false)

    const normalized = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`

    try {
      const res = await fetch(`/api/check-site?url=${encodeURIComponent(normalized)}`)
      if (!res.ok) throw new Error("API error")
      const data: { checks: CheckResult[] } = await res.json()
      setResults(buildCrawlReport(normalized, data.checks))
      await getSupabase()?.from("scanned_urls").insert({ url: normalized })
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleGateSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const name = gateName.trim()
    const email = gateEmail.trim()
    if (!name) { setGateError("Please enter your name"); return }
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setGateError("Please enter a valid email"); return }

    setGateLoading(true)
    setGateError("")

    try {
      const normalized = url.startsWith("http") ? url : `https://${url}`
      await getSupabase()?.from("scanned_urls").insert({ name, email, url: normalized })
    } catch {
      // Don't block unlock on DB error
    } finally {
      setGateLoading(false)
      setGateUnlocked(true)
    }
  }

  return (
    <div style={{ backgroundColor: "#f5f4ed", minHeight: "100vh" }}>
      {/* Nav */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ backgroundColor: "#f5f4ed", borderBottom: "1px solid #f0eee6" }}
      >
        <span
          className="text-base font-medium tracking-tight"
          style={{ fontFamily: "Georgia, serif", color: "#141413", fontWeight: 500 }}
        >
          AI Crawlability Test
        </span>
        <nav className="flex items-center gap-5">
          <Link
            href="/whats-new"
            className="text-sm font-medium hover-accent"
            style={{ color: "#5e5d59", textDecoration: "none" }}
          >
            What's new in AEO
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium hover-accent"
            style={{ color: "#5e5d59", textDecoration: "none" }}
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover-accent"
            style={{ color: "#5e5d59", textDecoration: "none" }}
          >
            About
          </Link>
        </nav>
      </header>

      <main>
      {/* Hero */}
      <section className="max-w-2xl mx-auto px-6 pt-20 pb-12 text-center">
        <p
          className="text-xs font-medium uppercase mb-6"
          style={{ color: "#87867f", letterSpacing: "0.5px" }}
        >
          Free AI Crawl Test
        </p>
        <h1
          className="mb-5"
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontWeight: 500,
            fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
            color: "#141413",
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
          }}
        >
          Test your site's crawlability
        </h1>
        <p
          className="text-lg max-w-lg mx-auto mb-10"
          style={{ color: "#5e5d59", lineHeight: 1.6 }}
        >
          Run a free AI crawl test to check whether AI crawlers, search bots, and agents can access your content — llms.txt, robots.txt, sitemap.xml, and more.
        </p>

        {/* Search form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-4">
          <Input
            type="text"
            placeholder="yourwebsite.com"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError("") }}
            className="flex-1 h-12 text-base"
            disabled={loading}
          />
          <Button type="submit" disabled={loading} size="lg" className="h-12 shrink-0">
            {loading
              ? <><Loader2 className="h-4 w-4 animate-spin" />Checking…</>
              : <><Search className="h-4 w-4" />Check site</>
            }
          </Button>
        </form>

        {error && <p className="text-sm mb-3" style={{ color: "#b53333" }}>{error}</p>}

      </section>

      {/* Loading */}
      {loading && (
        <section className="max-w-2xl mx-auto px-6 pb-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: "#c96442" }} />
          <p className="font-medium" style={{ color: "#141413" }}>Running full crawlability audit…</p>
          <p className="text-sm mt-1" style={{ color: "#87867f" }}>
            Checking AI discovery, structured data, performance, authority, and more
          </p>
        </section>
      )}

      {/* Results */}
      {!loading && results && (
        <section className="max-w-2xl mx-auto px-6 pb-20 space-y-4">

          {/* Preview: score card + first N checks */}
          <CrawlResults report={results} previewCount={gateUnlocked ? undefined : PREVIEW_COUNT} />

          {/* Gate — shown until unlocked */}
          {!gateUnlocked && (
            <div
              className="rounded-[12px] p-6"
              style={{
                backgroundColor: "#faf9f5",
                border: "1px solid #f0eee6",
                boxShadow: "rgba(0,0,0,0.04) 0px 4px 24px",
              }}
            >
              <div className="text-center mb-6">
                <p
                  className="text-xs font-medium uppercase tracking-[0.5px] mb-3"
                  style={{ color: "#87867f" }}
                >
                  Full report
                </p>
                <h3
                  className="mb-2"
                  style={{
                    fontFamily: "Georgia, serif",
                    fontWeight: 500,
                    fontSize: "1.3rem",
                    color: "#141413",
                    lineHeight: 1.2,
                  }}
                >
                  Unlock all {results.checks.length} checks
                </h3>
                <p className="text-sm max-w-sm mx-auto" style={{ color: "#5e5d59", lineHeight: 1.6 }}>
                  Enter your name and email to see the complete analysis, every recommendation, and your full score breakdown.
                </p>
              </div>

              <form
                onSubmit={handleGateSubmit}
                className="flex flex-col gap-3 max-w-sm mx-auto"
              >
                <input
                  type="text"
                  placeholder="Your name"
                  value={gateName}
                  onChange={(e) => { setGateName(e.target.value); setGateError("") }}
                  disabled={gateLoading}
                  className="flex h-10 w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors"
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #e8e5da",
                    color: "#141413",
                  }}
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={gateEmail}
                  onChange={(e) => { setGateEmail(e.target.value); setGateError("") }}
                  disabled={gateLoading}
                  className="flex h-10 w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors"
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #e8e5da",
                    color: "#141413",
                  }}
                />
                {gateError && (
                  <p className="text-sm" style={{ color: "#b53333" }}>{gateError}</p>
                )}
                <button
                  type="submit"
                  disabled={gateLoading}
                  className="h-10 rounded-md px-4 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#141413", color: "#faf9f5" }}
                >
                  {gateLoading
                    ? <><Loader2 className="h-4 w-4 animate-spin" />Unlocking…</>
                    : "See full report →"
                  }
                </button>
                <p
                  className="text-[11px] text-center"
                  style={{ color: "#b0aea5" }}
                >
                  No spam. Unsubscribe any time.
                </p>
              </form>
            </div>
          )}

        </section>
      )}

      {/* Feature grid — only when no results */}
      {!loading && !results && (
        <>
          <section className="max-w-2xl mx-auto px-6 pb-20">
            <h2
              className="text-center mb-8"
              style={{
                fontFamily: "Georgia, serif",
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
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{item.icon}</span>
                    {item.live && (
                      <span
                        className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: "rgba(58,124,82,0.1)", color: "#3a7c52" }}
                      >
                        Live
                      </span>
                    )}
                  </div>
                  <div
                    className="font-medium mb-1"
                    style={{ fontFamily: "Georgia, serif", fontWeight: 500, fontSize: "1rem", color: "#141413" }}
                  >
                    {item.title}
                  </div>
                  <div className="text-sm" style={{ color: "#5e5d59", lineHeight: 1.6 }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Blog preview */}
          <section className="max-w-2xl mx-auto px-6 pb-20">
            <div className="flex items-center justify-between mb-8">
              <h2
                style={{
                  fontFamily: "Georgia, serif",
                  fontWeight: 500,
                  fontSize: "1.3rem",
                  color: "#141413",
                  lineHeight: 1.2,
                }}
              >
                From the blog
              </h2>
              <Link
                href="/blog"
                className="text-sm transition-colors"
                style={{ color: "#c96442", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#a0502f")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#c96442")}
              >
                All posts →
              </Link>
            </div>
            <div className="flex flex-col" style={{ borderTop: "1px solid #e8e5da" }}>
              {BLOG_POSTS.slice(0, 3).map((post) => (
                <div
                  key={post.slug}
                  className="py-5"
                  style={{ borderBottom: "1px solid #e8e5da" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: "rgba(201,100,66,0.1)", color: "#c96442" }}
                    >
                      {post.category}
                    </span>
                    <span className="text-xs" style={{ color: "#87867f" }}>
                      {post.readingTimeMinutes} min read
                    </span>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <p
                      className="font-medium transition-colors"
                      style={{ fontFamily: "Georgia, serif", color: "#141413", fontSize: "1rem", lineHeight: 1.35 }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#c96442")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#141413")}
                    >
                      {post.title}
                    </p>
                  </Link>
                  <p className="text-sm mt-1.5" style={{ color: "#5e5d59", lineHeight: 1.55 }}>
                    {post.description.slice(0, 120)}…
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Dark section */}
          <section className="py-20 px-6" style={{ backgroundColor: "#141413" }}>
            <div className="max-w-2xl mx-auto text-center">
              <h2
                className="mb-5"
                style={{
                  fontFamily: "Georgia, serif",
                  fontWeight: 500,
                  fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                  color: "#faf9f5",
                  lineHeight: 1.2,
                }}
              >
                AI is the new search
              </h2>
              <p className="text-base max-w-lg mx-auto" style={{ color: "#b0aea5", lineHeight: 1.6 }}>
                ChatGPT, Claude, Perplexity, and AI-powered browsers are rapidly replacing
                traditional search as the way people find information. If your website isn't
                structured for AI crawlers, you risk becoming invisible — even if you rank
                well on Google today.
              </p>
            </div>
          </section>
        </>
      )}

      </main>

      {/* Footer */}
      <footer
        className="py-10 px-6"
        style={{ borderTop: "1px solid #f0eee6", backgroundColor: "#f5f4ed" }}
      >
        <div className="max-w-2xl mx-auto">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4">
            <Link href="/about" className="text-xs hover-accent" style={{ color: "#87867f", textDecoration: "none" }}>About</Link>
            <Link href="/blog" className="text-xs hover-accent" style={{ color: "#87867f", textDecoration: "none" }}>Blog</Link>
            <Link href="/faq" className="text-xs hover-accent" style={{ color: "#87867f", textDecoration: "none" }}>FAQ</Link>
            <Link href="/contact" className="text-xs hover-accent" style={{ color: "#87867f", textDecoration: "none" }}>Contact</Link>
            <Link href="/privacy" className="text-xs hover-accent" style={{ color: "#87867f", textDecoration: "none" }}>Privacy</Link>
            <Link href="/changelog" className="text-xs hover-accent" style={{ color: "#87867f", textDecoration: "none" }}>Changelog</Link>
            <a href="https://x.com/aicrawltest" rel="noopener noreferrer" className="text-xs hover-accent" style={{ color: "#87867f", textDecoration: "none" }}>X / Twitter</a>
          </nav>
          <p className="text-xs text-center" style={{ color: "#b0aea5" }}>
            All checks are live — fetched directly from your site in real time.
          </p>
        </div>
      </footer>
    </div>
  )
}
