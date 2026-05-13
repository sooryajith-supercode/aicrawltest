import { NextRequest, NextResponse } from "next/server"
import type { CheckResult } from "@/lib/crawl-data"

const USER_AGENT = "AI-Crawlability-Bot/1.0 (+https://aicrawltest.vercel.app)"
const TIMEOUT_MS = 7000

async function tryFetch(url: string, extraHeaders?: Record<string, string>): Promise<Response | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": USER_AGENT, Accept: "*/*", ...extraHeaders },
      redirect: "follow",
    })
    clearTimeout(timer)
    return res
  } catch {
    clearTimeout(timer)
    return null
  }
}

async function checkLlmsTxt(origin: string): Promise<CheckResult> {
  const candidates = [`${origin}/llms.txt`, `${origin}/.well-known/llms.txt`]
  for (const url of candidates) {
    const res = await tryFetch(url)
    if (!res?.ok) continue
    const text = await res.text()
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean)
    const entries = lines.filter((l) => /^-\s+\[.+?\]\(.+?\)/.test(l)).length
    const sections = lines.filter((l) => l.startsWith("## ")).length
    const details: string[] = [`Found at ${url}`]
    if (entries) details.push(`${entries} ${entries === 1 ? "entry" : "entries"}`)
    if (sections) details.push(`${sections} ${sections === 1 ? "section" : "sections"}`)
    const hasTitle = lines.some((l) => /^#\s+\S/.test(l) && !l.startsWith("##"))
    const hasDesc = lines.some((l) => l.startsWith("> "))
    if (hasTitle && hasDesc) details.push("Properly structured")
    else if (!hasTitle || !hasDesc) details.push("Incomplete spec format")
    return {
      id: "llms-txt", category: "Discovery", name: "llms.txt present",
      description: "A machine-readable file that tells AI systems how to interact with the site",
      status: "pass", detail: details.join(" · "), weight: 20, isReal: true,
    }
  }
  return {
    id: "llms-txt", category: "Discovery", name: "llms.txt present",
    description: "A machine-readable file that tells AI systems how to interact with the site",
    status: "fail", detail: `No llms.txt found at ${origin}/llms.txt or /.well-known/llms.txt`,
    recommendation: "Create a /llms.txt file following the llmstxt.org specification — include a # title, > description, and ## sections with linked resources",
    weight: 20, isReal: true,
  }
}

async function checkRobotsTxt(origin: string): Promise<CheckResult> {
  const res = await tryFetch(`${origin}/robots.txt`)
  if (!res?.ok) {
    return {
      id: "robots-ai", category: "Discovery", name: "robots.txt AI directives",
      description: "robots.txt includes directives for known AI crawlers (GPTBot, ClaudeBot, etc.)",
      status: "fail", detail: "No robots.txt found",
      recommendation: "Create a robots.txt and add explicit allow rules for GPTBot, ClaudeBot, PerplexityBot",
      weight: 15, isReal: true,
    }
  }
  const text = await res.text()
  const aiBots = ["GPTBot", "ClaudeBot", "PerplexityBot", "anthropic-ai", "ChatGPT-User", "Googlebot-Extended"]
  const mentioned = aiBots.filter((b) => text.includes(b))

  // Detect if any AI bot section has a broad Disallow
  const blocked = mentioned.filter((bot) => {
    const idx = text.indexOf(bot)
    const snippet = text.substring(idx, idx + 300)
    return /Disallow:\s*\/(?!\S)/.test(snippet)
  })

  if (blocked.length > 0) {
    return {
      id: "robots-ai", category: "Discovery", name: "robots.txt AI directives",
      description: "robots.txt includes directives for known AI crawlers",
      status: "fail", detail: `${blocked.join(", ")} ${blocked.length === 1 ? "is" : "are"} blocked in robots.txt`,
      recommendation: "Review and remove broad Disallow rules for AI crawlers",
      weight: 15, isReal: true,
    }
  }
  if (mentioned.length === 0) {
    return {
      id: "robots-ai", category: "Discovery", name: "robots.txt AI directives",
      description: "robots.txt includes directives for known AI crawlers",
      status: "warning", detail: "robots.txt found but no explicit AI crawler rules detected",
      recommendation: "Add explicit User-agent sections for GPTBot, ClaudeBot, PerplexityBot with Allow: /",
      weight: 15, isReal: true,
    }
  }
  return {
    id: "robots-ai", category: "Discovery", name: "robots.txt AI directives",
    description: "robots.txt includes directives for known AI crawlers",
    status: "pass", detail: `AI crawlers explicitly listed: ${mentioned.join(", ")}`,
    weight: 15, isReal: true,
  }
}

async function checkSitemap(origin: string): Promise<CheckResult> {
  const candidates = [`${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`, `${origin}/sitemap`]
  for (const url of candidates) {
    const res = await tryFetch(url)
    if (!res?.ok) continue
    const text = await res.text()
    const urlCount = (text.match(/<url>/gi) ?? []).length
    const sitemapCount = (text.match(/<sitemap>/gi) ?? []).length
    const count = urlCount + sitemapCount
    return {
      id: "sitemap", category: "Discovery", name: "XML Sitemap",
      description: "Sitemap helps AI agents discover all pages systematically",
      status: "pass",
      detail: `Found at ${url}${count ? ` · ${count} ${urlCount > 0 ? "URLs" : "sitemaps"}` : ""}`,
      weight: 10, isReal: true,
    }
  }
  return {
    id: "sitemap", category: "Discovery", name: "XML Sitemap",
    description: "Sitemap helps AI agents discover all pages systematically",
    status: "fail", detail: "No sitemap.xml found",
    recommendation: "Generate an XML sitemap and reference it in robots.txt via Sitemap: directive",
    weight: 10, isReal: true,
  }
}

async function checkKnowledgeHub(origin: string): Promise<CheckResult> {
  const paths = ["/docs", "/help", "/documentation", "/knowledge-base", "/faq", "/support", "/guide", "/guides"]
  const results = await Promise.all(paths.map((p) => tryFetch(`${origin}${p}`)))
  const found = paths.find((_, i) => results[i]?.ok)
  if (found) {
    return {
      id: "knowledge-hub", category: "Content", name: "Knowledge hub / docs",
      description: "Dedicated documentation or knowledge base that AI can index for accurate answers",
      status: "pass", detail: `Documentation section found at ${found}`,
      weight: 15, isReal: true,
    }
  }
  return {
    id: "knowledge-hub", category: "Content", name: "Knowledge hub / docs",
    description: "Dedicated documentation or knowledge base that AI can index for accurate answers",
    status: "fail", detail: "No documentation or knowledge hub detected at common paths (/docs, /help, /faq, /support)",
    recommendation: "Create a /docs or /help section with structured, linkable content AI can index",
    weight: 15, isReal: true,
  }
}

async function checkApiAccess(origin: string): Promise<CheckResult> {
  const paths = ["/api", "/feed", "/rss", "/feed.xml", "/rss.xml", "/atom.xml"]
  const results = await Promise.all(paths.map((p) => tryFetch(`${origin}${p}`)))
  const found = paths.find((_, i) => results[i]?.ok)
  if (found) {
    return {
      id: "api-access", category: "Access", name: "Public API or data feed",
      description: "Structured API endpoints allow AI agents to access data programmatically",
      status: "pass", detail: `Public endpoint found at ${found}`,
      weight: 10, isReal: true,
    }
  }
  return {
    id: "api-access", category: "Access", name: "Public API or data feed",
    description: "Structured API endpoints allow AI agents to access data programmatically",
    status: "info", detail: "No public API or RSS/Atom feed detected at common paths",
    recommendation: "Consider exposing a read-only REST API, RSS, or Atom feed for AI access",
    weight: 10, isReal: true,
  }
}

async function checkMarkdownRepresentation(origin: string): Promise<CheckResult> {
  const base: Omit<CheckResult, "status" | "detail" | "recommendation"> = {
    id: "markdown-repr",
    category: "Content",
    name: "Markdown representation",
    description: "Pages serve a Markdown version so AI agents can consume clean, structured text",
    weight: 10,
    isReal: true,
  }

  // Strategy 1: /page.md and /index.md
  for (const path of ["/index.md", "/page.md"]) {
    const res = await tryFetch(`${origin}${path}`)
    if (res?.ok) {
      const ct = res.headers.get("content-type") ?? ""
      const ctLabel = ct ? ` · Content-Type: ${ct.split(";")[0].trim()}` : ""
      return { ...base, status: "pass", detail: `Markdown file served at ${path}${ctLabel}` }
    }
  }

  // Strategy 2: query params — ?format=markdown, ?markdown=1, ?output=markdown
  for (const qs of ["format=markdown", "markdown=1", "output=markdown"]) {
    const url = `${origin}/?${qs}`
    const res = await tryFetch(url, { Accept: "text/markdown, text/plain;q=0.9" })
    if (res?.ok) {
      const ct = res.headers.get("content-type") ?? ""
      if (/markdown|text\/plain/i.test(ct)) {
        return {
          ...base,
          status: "pass",
          detail: `Markdown via query param (?${qs}) · Content-Type: ${ct.split(";")[0].trim()}`,
        }
      }
    }
  }

  // Strategy 3: Accept: text/markdown content negotiation
  const negotiated = await tryFetch(`${origin}/`, { Accept: "text/markdown" })
  if (negotiated?.ok) {
    const ct = negotiated.headers.get("content-type") ?? ""
    if (/markdown/i.test(ct)) {
      return {
        ...base,
        status: "pass",
        detail: `Server honours Accept: text/markdown · Content-Type: ${ct.split(";")[0].trim()}`,
      }
    }
  }

  return {
    ...base,
    status: "fail",
    detail: "No Markdown representation found via .md URL, query params, or Accept: text/markdown header",
    recommendation:
      "Expose Markdown versions of pages at /page.md, respond to ?format=markdown, or support Accept: text/markdown content negotiation so AI agents receive clean text",
  }
}

async function checkHomepage(origin: string): Promise<CheckResult[]> {
  const res = await tryFetch(origin)

  const loginWall: CheckResult = {
    id: "login-wall", category: "Access", name: "No login wall on key pages",
    description: "Main content is accessible without authentication so AI crawlers can index it",
    status: res?.ok && !(res.redirected && /login|signin|auth/i.test(res.url)) ? "pass" : "fail",
    detail: res?.ok ? "Homepage is publicly accessible" : "Homepage appears to require authentication or is unreachable",
    recommendation: !res?.ok ? "Ensure homepage and key content pages are publicly accessible" : undefined,
    weight: 10, isReal: true,
  }

  if (!res?.ok) {
    return [
      { id: "structured-data", category: "Content", name: "Structured data (JSON-LD)", description: "Schema.org markup helps AI understand page context", status: "fail", detail: "Could not fetch homepage to check", weight: 10, isReal: true },
      { id: "open-graph", category: "Metadata", name: "Open Graph / meta tags", description: "Rich metadata helps AI summarize and represent the page", status: "fail", detail: "Could not fetch homepage to check", weight: 5, isReal: true },
      { id: "canonical", category: "Metadata", name: "Canonical URLs", description: "Canonical link tags prevent duplicate content issues for AI crawlers", status: "fail", detail: "Could not fetch homepage to check", weight: 5, isReal: true },
      loginWall,
    ]
  }

  const html = await res.text()

  // Structured data
  const jsonLdBlocks = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) ?? []
  const schemas: string[] = []
  for (const block of jsonLdBlocks) {
    try {
      const jsonStr = block.replace(/<script[^>]*>/i, "").replace(/<\/script>/i, "").trim()
      const obj = JSON.parse(jsonStr)
      const types = obj["@type"]
        ? [obj["@type"]]
        : Array.isArray(obj["@graph"])
          ? (obj["@graph"] as Array<{ "@type"?: string }>).map((g) => g["@type"]).filter(Boolean)
          : []
      schemas.push(...(types as string[]))
    } catch { /* malformed JSON — skip */ }
  }
  const structuredData: CheckResult = {
    id: "structured-data", category: "Content", name: "Structured data (JSON-LD)",
    description: "Schema.org markup helps AI understand page context",
    status: schemas.length > 0 ? "pass" : "fail",
    detail: schemas.length > 0 ? `Schemas found: ${schemas.slice(0, 4).join(", ")}` : "No JSON-LD structured data found on homepage",
    recommendation: schemas.length === 0 ? "Add at minimum Organization and WebSite schemas via JSON-LD" : undefined,
    weight: 10, isReal: true,
  }

  // Open Graph
  const hasOgTitle = /property=["']og:title["']/i.test(html)
  const hasOgDesc = /property=["']og:description["']/i.test(html)
  const hasOgImage = /property=["']og:image["']/i.test(html)
  const hasMetaDesc = /name=["']description["']/i.test(html)
  const present = [hasOgTitle && "og:title", hasOgDesc && "og:description", hasOgImage && "og:image", hasMetaDesc && "meta description"].filter(Boolean)
  const openGraph: CheckResult = {
    id: "open-graph", category: "Metadata", name: "Open Graph / meta tags",
    description: "Rich metadata helps AI summarize and represent the page accurately",
    status: present.length >= 3 ? "pass" : present.length >= 1 ? "warning" : "fail",
    detail: present.length > 0 ? `Found: ${present.join(", ")}` : "No Open Graph or meta description tags found",
    recommendation: present.length < 3 ? "Add og:title, og:description, og:image and meta description to all pages" : undefined,
    weight: 5, isReal: true,
  }

  // Canonical
  const hasCanonical = /rel=["']canonical["']/i.test(html)
  const canonical: CheckResult = {
    id: "canonical", category: "Metadata", name: "Canonical URLs",
    description: "Canonical link tags prevent AI crawlers from indexing duplicate content",
    status: hasCanonical ? "pass" : "warning",
    detail: hasCanonical ? "Canonical tag found on homepage" : "No canonical tag found on homepage",
    recommendation: !hasCanonical ? "Add <link rel=\"canonical\"> to all pages to avoid duplicate content issues" : undefined,
    weight: 5, isReal: true,
  }

  return [structuredData, openGraph, canonical, loginWall]
}

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url")
  if (!rawUrl) return NextResponse.json({ error: "url param required" }, { status: 400 })

  let origin: string
  try {
    const parsed = new URL(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`)
    origin = `${parsed.protocol}//${parsed.hostname}`
  } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 })
  }

  const [llmsTxt, robotsTxt, sitemap, knowledgeHub, apiAccess, markdownRepr, homepageChecks] = await Promise.all([
    checkLlmsTxt(origin),
    checkRobotsTxt(origin),
    checkSitemap(origin),
    checkKnowledgeHub(origin),
    checkApiAccess(origin),
    checkMarkdownRepresentation(origin),
    checkHomepage(origin),
  ])

  const checks: CheckResult[] = [
    llmsTxt,
    robotsTxt,
    sitemap,
    knowledgeHub,
    ...homepageChecks,
    markdownRepr,
    apiAccess,
  ]

  return NextResponse.json({ checks })
}