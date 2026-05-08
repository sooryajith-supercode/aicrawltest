"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { BLOG_POSTS } from "@/lib/blog"
import { getSupabase } from "@/lib/supabase"

interface FileCheckResult {
  found: boolean
  url: string
}

interface RobotsDirectives {
  userAgentStar: boolean
  hasDisallow: boolean
  hasAllow: boolean
  hasSitemap: boolean
}

interface RobotsTxtResult extends FileCheckResult {
  directives: RobotsDirectives | null
}

interface PageMarkdownEntry {
  url: string
  markdownUrl: string
  found: boolean
}

interface PageMarkdownResult {
  checked: number
  found: number
  pages: PageMarkdownEntry[]
}

interface CheckFilesResponse {
  llmsTxt: FileCheckResult
  robotsTxt: RobotsTxtResult
  sitemapXml: FileCheckResult
  pageMarkdown: PageMarkdownResult
}

const FEATURES = [
  { icon: "📄", title: "llms.txt", desc: "Checks for the emerging AI-readable site manifest that tells LLMs how to interact with the site.", live: true },
  { icon: "🤖", title: "Robots.txt", desc: "Verifies robots.txt exists so AI crawlers know how to interact with the site.", live: true },
  { icon: "🗺️", title: "Sitemap.xml", desc: "Checks for a sitemap across common paths and via any Sitemap: directives declared in robots.txt.", live: true },
  { icon: "📝", title: "Per-page markdown", desc: "Fetches your homepage and one other page and checks for a <link type=\"text/markdown\"> tag declaring the Markdown version.", live: true },
]

function ResultCard({ label, icon, result }: { label: string; icon: string; result: FileCheckResult }) {
  return (
    <div
      className="rounded-[8px] p-5 flex items-start gap-4"
      style={{
        backgroundColor: "#faf9f5",
        border: `1px solid ${result.found ? "rgba(58,124,82,0.25)" : "rgba(181,51,51,0.25)"}`,
        boxShadow: "rgba(0,0,0,0.04) 0px 4px 24px",
      }}
    >
      <span className="text-2xl mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="font-medium"
            style={{ fontFamily: "Georgia, serif", fontSize: "1rem", color: "#141413" }}
          >
            {label}
          </span>
          {result.found ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "#3a7c52" }} />
          ) : (
            <XCircle className="h-4 w-4 shrink-0" style={{ color: "#b53333" }} />
          )}
        </div>
        <p className="text-sm break-all" style={{ color: "#5e5d59", lineHeight: 1.6 }}>
          {result.found ? (
            <>
              <span style={{ color: "#3a7c52", fontWeight: 500 }}>Found</span> at{" "}
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
                style={{ color: "#c96442" }}
              >
                {result.url}
              </a>
            </>
          ) : (
            <>
              <span style={{ color: "#b53333", fontWeight: 500 }}>Not found</span> — checked{" "}
              <span style={{ color: "#87867f" }}>{result.url}</span>
            </>
          )}
        </p>
      </div>
    </div>
  )
}

function DirectiveRow({ label, present }: { label: string; present: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {present ? (
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: "#3a7c52" }} />
      ) : (
        <XCircle className="h-3.5 w-3.5 shrink-0" style={{ color: "#b53333" }} />
      )}
      <code
        className="text-xs"
        style={{ color: present ? "#3a7c52" : "#b53333", fontWeight: present ? 500 : 400 }}
      >
        {label}
      </code>
      {!present && (
        <span className="text-xs" style={{ color: "#87867f" }}>missing</span>
      )}
    </div>
  )
}

function MarkdownCard({ result }: { result: PageMarkdownResult }) {
  const allFound = result.found === result.checked
  const noneFound = result.found === 0
  const borderColor = allFound
    ? "rgba(58,124,82,0.25)"
    : noneFound
    ? "rgba(181,51,51,0.25)"
    : "rgba(201,100,66,0.25)"
  const statusColor = allFound ? "#3a7c52" : noneFound ? "#b53333" : "#c96442"
  const statusText = allFound
    ? "All pages have markdown"
    : noneFound
    ? "No markdown files found"
    : `${result.found} of ${result.checked} pages have markdown`

  return (
    <div
      className="rounded-[8px] p-5 flex items-start gap-4"
      style={{
        backgroundColor: "#faf9f5",
        border: `1px solid ${borderColor}`,
        boxShadow: "rgba(0,0,0,0.04) 0px 4px 24px",
      }}
    >
      <span className="text-2xl mt-0.5">📝</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="font-medium"
            style={{ fontFamily: "Georgia, serif", fontSize: "1rem", color: "#141413" }}
          >
            Per-page markdown (.md)
          </span>
          {allFound ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "#3a7c52" }} />
          ) : (
            <XCircle className="h-4 w-4 shrink-0" style={{ color: noneFound ? "#b53333" : "#c96442" }} />
          )}
        </div>
        <p className="text-sm mb-3" style={{ color: "#5e5d59", lineHeight: 1.6 }}>
          <span style={{ color: statusColor, fontWeight: 500 }}>{statusText}</span>
          {" "}— checked {result.checked} {result.checked === 1 ? "page" : "pages"} for{" "}
          <code style={{ color: "#87867f", fontSize: "0.8rem" }}>{"<link type=\"text/markdown\">"}</code>
        </p>
        {result.pages.length > 0 && (
          <div
            className="rounded-[6px] p-3 flex flex-col gap-1.5"
            style={{ backgroundColor: "#f0eee6", border: "1px solid #e8e5da" }}
          >
            <p className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: "#87867f" }}>
              Pages checked
            </p>
            {result.pages.map((page) => (
              <div key={page.url} className="flex items-start gap-2">
                {page.found ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: "#3a7c52" }} />
                ) : (
                  <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: "#b53333" }} />
                )}
                <div className="min-w-0">
                  <p className="text-xs break-all" style={{ color: "#87867f" }}>
                    {page.url.replace(/^https?:\/\/[^/]+/, "") || "/"}
                  </p>
                  <p className="text-[11px] break-all" style={{ color: page.found ? "#3a7c52" : "#b53333" }}>
                    {page.found
                      ? `link tag found → ${page.markdownUrl}`
                      : "no <link type=\"text/markdown\"> found"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {noneFound && (
          <p className="text-xs mt-2" style={{ color: "#87867f", lineHeight: 1.5 }}>
            Add <code style={{ color: "#c96442" }}>{"<link rel=\"alternate\" type=\"text/markdown\" href=\"/page.md\">"}</code> to each page&apos;s <code style={{ color: "#c96442" }}>&lt;head&gt;</code> so AI agents can discover the clean Markdown version.
          </p>
        )}
      </div>
    </div>
  )
}

function RobotsCard({ result }: { result: RobotsTxtResult }) {
  return (
    <div
      className="rounded-[8px] p-5 flex items-start gap-4"
      style={{
        backgroundColor: "#faf9f5",
        border: `1px solid ${result.found ? "rgba(58,124,82,0.25)" : "rgba(181,51,51,0.25)"}`,
        boxShadow: "rgba(0,0,0,0.04) 0px 4px 24px",
      }}
    >
      <span className="text-2xl mt-0.5">🤖</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="font-medium"
            style={{ fontFamily: "Georgia, serif", fontSize: "1rem", color: "#141413" }}
          >
            robots.txt
          </span>
          {result.found ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "#3a7c52" }} />
          ) : (
            <XCircle className="h-4 w-4 shrink-0" style={{ color: "#b53333" }} />
          )}
        </div>
        <p className="text-sm break-all mb-3" style={{ color: "#5e5d59", lineHeight: 1.6 }}>
          {result.found ? (
            <>
              <span style={{ color: "#3a7c52", fontWeight: 500 }}>Found</span> at{" "}
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
                style={{ color: "#c96442" }}
              >
                {result.url}
              </a>
            </>
          ) : (
            <>
              <span style={{ color: "#b53333", fontWeight: 500 }}>Not found</span> — checked{" "}
              <span style={{ color: "#87867f" }}>{result.url}</span>
            </>
          )}
        </p>
        {result.found && result.directives && (
          <div
            className="rounded-[6px] p-3 flex flex-col gap-1.5"
            style={{ backgroundColor: "#f0eee6", border: "1px solid #e8e5da" }}
          >
            <p className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: "#87867f" }}>
              Directives
            </p>
            <DirectiveRow label="User-agent: *" present={result.directives.userAgentStar} />
            <DirectiveRow label="Disallow:" present={result.directives.hasDisallow} />
            <DirectiveRow label="Allow:" present={result.directives.hasAllow} />
            <DirectiveRow label="Sitemap:" present={result.directives.hasSitemap} />
          </div>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  const [url, setUrl] = useState("")
  const [results, setResults] = useState<CheckFilesResponse | null>(null)
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) { setError("Please enter a URL"); return }
    if (!isValidUrl(trimmed)) { setError("Please enter a valid URL"); return }

    setError("")
    setLoading(true)
    setResults(null)

    const normalized = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`

    try {
      const res = await fetch(`/api/check-files?url=${encodeURIComponent(normalized)}`)
      if (!res.ok) throw new Error("API error")
      const data: CheckFilesResponse = await res.json()
      setResults(data)
      await getSupabase()?.from("scanned_urls").insert({ url: normalized })
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const examples = ["anthropic.com", "openai.com", "github.com", "example.com"]

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
        <div className="flex items-center gap-5">
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
          <span className="text-xs" style={{ color: "#87867f" }}>
            v{process.env.NEXT_PUBLIC_APP_VERSION} · Live checks
          </span>
        </div>
      </header>

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

        {/* Example links */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
          <span className="text-sm" style={{ color: "#87867f" }}>Try:</span>
          {examples.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => { setUrl(ex); setError(""); setResults(null) }}
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
          <p className="font-medium" style={{ color: "#141413" }}>Checking files…</p>
          <p className="text-sm mt-1" style={{ color: "#87867f" }}>
            Looking up llms.txt, robots.txt, sitemap.xml, and markdown link tags
          </p>
        </section>
      )}

      {/* Results */}
      {!loading && results && (
        <section className="max-w-2xl mx-auto px-6 pb-20 space-y-4">
          <p
            className="text-xs font-medium uppercase mb-2"
            style={{ color: "#87867f", letterSpacing: "0.5px" }}
          >
            Results for {url.replace(/^https?:\/\//, "")}
          </p>
          <ResultCard label="llms.txt" icon="📄" result={results.llmsTxt} />
          <RobotsCard result={results.robotsTxt} />
          <ResultCard label="sitemap.xml" icon="🗺️" result={results.sitemapXml} />
          <MarkdownCard result={results.pageMarkdown} />
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

      {/* Footer */}
      <footer
        className="text-center py-8 px-6"
        style={{ borderTop: "1px solid #f0eee6", backgroundColor: "#f5f4ed" }}
      >
        <p className="text-xs" style={{ color: "#87867f" }}>
          All checks are live — fetched directly from your site in real time.{" "}
          <Link href="/changelog" className="underline underline-offset-2 hover-accent" style={{ color: "#87867f" }}>
            Changelog
          </Link>
        </p>
      </footer>
    </div>
  )
}
