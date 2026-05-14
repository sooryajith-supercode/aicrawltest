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

async function checkSitewideSEO(origin: string): Promise<CheckResult[]> {
  // Discover pages from sitemap; fall back to homepage only
  let urls: string[] = [origin]
  const sitemapRes = await tryFetch(`${origin}/sitemap.xml`)
  if (sitemapRes?.ok) {
    const xml = await sitemapRes.text()
    const extracted = (xml.match(/<loc>(https?:\/\/[^<]+)<\/loc>/gi) ?? [])
      .map((m) => m.replace(/<\/?loc>/gi, "").trim())
      .filter((u) => u.startsWith(origin) && !u.endsWith(".xml"))
    if (extracted.length > 0) urls = extracted.slice(0, 5)
  }

  type PageData = { path: string; html: string }
  const pages: PageData[] = (
    await Promise.all(
      urls.map(async (u) => {
        const res = await tryFetch(u)
        if (!res?.ok) return null
        return { path: new URL(u).pathname || "/", html: await res.text() }
      })
    )
  ).filter(Boolean) as PageData[]

  if (pages.length === 0) {
    const unreachable = (id: string, name: string, desc: string): CheckResult => ({
      id, name, description: desc, category: "SEO",
      status: "fail", detail: "Could not fetch any pages to audit", weight: 8, isReal: true,
    })
    return [
      unreachable("meta-title", "Meta title — all pages", "Every page needs a unique <title> for AI and search engines"),
      unreachable("meta-description", "Meta description — all pages", "Every page needs a meta description for AI snippet generation"),
      unreachable("page-schema", "Structured data — all pages", "JSON-LD schema on every page helps AI agents understand content"),
    ]
  }

  function audit(
    id: string, name: string, description: string,
    test: (html: string) => boolean,
    recommendation: string,
  ): CheckResult {
    const results = pages.map((p) => ({ path: p.path, ok: test(p.html) }))
    const passing = results.filter((r) => r.ok).length
    const missing = results.filter((r) => !r.ok).map((r) => r.path)
    const ratio = passing / pages.length
    return {
      id, name, description, category: "SEO",
      status: ratio === 1 ? "pass" : ratio >= 0.5 ? "warning" : "fail",
      detail: `${passing}/${pages.length} pages · ${missing.length === 0 ? "All pages covered" : `Missing on: ${missing.slice(0, 3).join(", ")}${missing.length > 3 ? ` +${missing.length - 3} more` : ""}`}`,
      recommendation: missing.length > 0 ? recommendation : undefined,
      weight: 8, isReal: true,
    }
  }

  return [
    audit(
      "meta-title", "Meta title — all pages",
      "Every page must have a unique <title> tag; AI and search engines use it as the primary label",
      (html) => /<title[^>]*>[^<\s][^<]*<\/title>/i.test(html),
      "Add a descriptive <title> to every page — keep it under 60 characters and unique per page",
    ),
    audit(
      "meta-description", "Meta description — all pages",
      "A meta description on every page gives AI agents a reliable summary to surface in answers",
      (html) => /name=["']description["'][^>]+content=["'][^"']{10}/i.test(html) ||
                /content=["'][^"']{10}[^>]+name=["']description["']/i.test(html),
      "Add <meta name=\"description\" content=\"…\"> to every page — aim for 120–160 characters",
    ),
    audit(
      "page-schema", "Structured data — all pages",
      "JSON-LD schema markup on every page helps AI agents understand the type and context of content",
      (html) => /<script[^>]+type=["']application\/ld\+json["']/i.test(html),
      "Add relevant JSON-LD schema (Article, Product, FAQPage, etc.) to each page type",
    ),
  ]
}

async function checkCleanStructure(origin: string): Promise<CheckResult> {
  const res = await tryFetch(origin)
  if (!res?.ok) {
    return {
      id: "clean-structure", category: "Structure", name: "Clean HTML structure",
      description: "Semantic HTML elements and a clear heading hierarchy help AI parse page content correctly",
      status: "fail", detail: "Could not fetch homepage to check", weight: 8, isReal: true,
    }
  }
  const html = await res.text()
  const h1Count = (html.match(/<h1[\s>]/gi) ?? []).length
  const hasH2 = /<h2[\s>]/i.test(html)
  const hasMain = /<main[\s>]/i.test(html)
  const hasNav = /<nav[\s>]/i.test(html)
  const hasFooter = /<footer[\s>]/i.test(html)

  const present = [
    h1Count === 1 && "single H1",
    hasH2 && "H2 headings",
    hasMain && "<main>",
    hasNav && "<nav>",
    hasFooter && "<footer>",
  ].filter(Boolean) as string[]

  const issues = [
    h1Count === 0 && "no H1",
    h1Count > 1 && `${h1Count} H1 tags (should be 1)`,
    !hasMain && "no <main>",
  ].filter(Boolean) as string[]

  return {
    id: "clean-structure", category: "Structure", name: "Clean HTML structure",
    description: "Semantic HTML elements and a clear heading hierarchy help AI parse page content correctly",
    status: issues.length === 0 && present.length >= 4 ? "pass" : issues.length === 0 ? "warning" : "fail",
    detail: [
      present.length > 0 ? `Found: ${present.join(", ")}` : null,
      issues.length > 0 ? `Issues: ${issues.join(", ")}` : null,
    ].filter(Boolean).join(" · "),
    recommendation: issues.length > 0
      ? "Use a single H1 per page and semantic elements (<main>, <nav>, <footer>) so AI can reliably parse your content hierarchy"
      : undefined,
    weight: 8, isReal: true,
  }
}

async function checkPerformance(origin: string): Promise<CheckResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  const start = Date.now()
  let res: Response | null = null
  try {
    res = await fetch(origin, {
      signal: controller.signal,
      headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
      redirect: "follow",
    })
    clearTimeout(timer)
  } catch {
    clearTimeout(timer)
  }
  const ttfb = Date.now() - start

  if (!res?.ok) {
    return {
      id: "performance", category: "Performance", name: "Server response time",
      description: "Fast TTFB and compressed responses let AI crawlers index content efficiently",
      status: "fail", detail: "Server did not respond", weight: 8, isReal: true,
    }
  }

  const encoding = res.headers.get("content-encoding") ?? ""
  const hasCompression = /gzip|br|zstd/i.test(encoding)
  const perfStatus: CheckResult["status"] = ttfb < 800 ? "pass" : ttfb < 2000 ? "warning" : "fail"

  return {
    id: "performance", category: "Performance", name: "Server response time",
    description: "Fast TTFB and compressed responses let AI crawlers index content efficiently",
    status: perfStatus,
    detail: `TTFB: ${ttfb}ms · Compression: ${hasCompression ? encoding : "none detected"}`,
    recommendation: perfStatus !== "pass"
      ? ttfb >= 2000
        ? `Response took ${ttfb}ms — optimise with a CDN or caching layer to keep TTFB under 800ms`
        : "Enable gzip or Brotli compression to reduce payload size for crawlers"
      : undefined,
    weight: 8, isReal: true,
  }
}

async function checkFreshContent(origin: string): Promise<CheckResult> {
  const [homeRes, sitemapRes] = await Promise.all([
    tryFetch(origin),
    tryFetch(`${origin}/sitemap.xml`),
  ])

  const signals: string[] = []
  let hasRecent = false

  if (homeRes?.ok) {
    const lastMod = homeRes.headers.get("last-modified")
    if (lastMod) {
      const days = Math.floor((Date.now() - new Date(lastMod).getTime()) / 86400000)
      signals.push(`Last-Modified: ${days}d ago`)
      if (days < 180) hasRecent = true
    }
  }

  if (sitemapRes?.ok) {
    const xml = await sitemapRes.text()
    const dates = (xml.match(/<lastmod>([^<]+)<\/lastmod>/gi) ?? [])
      .map((m) => m.replace(/<\/?lastmod>/gi, "").trim())
      .filter((d) => !isNaN(new Date(d).getTime()))
    if (dates.length > 0) {
      const latest = Math.max(...dates.map((d) => new Date(d).getTime()))
      const days = Math.floor((Date.now() - latest) / 86400000)
      signals.push(`Sitemap lastmod: ${days}d ago`)
      if (days < 90) hasRecent = true
    } else {
      signals.push("Sitemap has no lastmod dates")
    }
  }

  if (signals.length === 0) {
    return {
      id: "fresh-content", category: "Content", name: "Fresh content signals",
      description: "Recent dates signal to AI indexers that the site is actively maintained",
      status: "warning",
      detail: "No freshness signals found (no Last-Modified header or sitemap lastmod dates)",
      recommendation: "Add Last-Modified response headers and <lastmod> dates to your sitemap entries",
      weight: 8, isReal: true,
    }
  }

  return {
    id: "fresh-content", category: "Content", name: "Fresh content signals",
    description: "Recent dates signal to AI indexers that the site is actively maintained",
    status: hasRecent ? "pass" : "warning",
    detail: signals.join(" · "),
    recommendation: !hasRecent
      ? "Content signals appear stale — publish new content and keep sitemap lastmod dates current"
      : undefined,
    weight: 8, isReal: true,
  }
}

async function checkInternalLinking(origin: string): Promise<CheckResult> {
  const res = await tryFetch(origin)
  if (!res?.ok) {
    return {
      id: "internal-linking", category: "Structure", name: "Internal linking",
      description: "Internal links help AI crawlers discover all your content and understand site structure",
      status: "fail", detail: "Could not fetch homepage to check", weight: 8, isReal: true,
    }
  }

  const html = await res.text()
  const hostname = new URL(origin).hostname
  const hrefs = [...html.matchAll(/href=["']([^"'#?][^"']*)["']/gi)].map((m) => m[1])
  const internal = new Set(
    hrefs.filter((h) => h.startsWith("/") || h.includes(hostname))
  )
  const count = internal.size

  return {
    id: "internal-linking", category: "Structure", name: "Internal linking",
    description: "Internal links help AI crawlers discover all your content and understand site structure",
    status: count >= 10 ? "pass" : count >= 4 ? "warning" : "fail",
    detail: `${count} unique internal links on homepage`,
    recommendation: count < 10
      ? count < 4
        ? "Add more internal links — link to key pages from the homepage so AI crawlers can discover your full content"
        : "Consider cross-linking more content sections to help AI agents map your site structure"
      : undefined,
    weight: 8, isReal: true,
  }
}

async function checkAuthority(origin: string): Promise<CheckResult> {
  const res = await tryFetch(origin)
  if (!res?.ok) {
    return {
      id: "authority", category: "Authority", name: "Authority signals",
      description: "Organization schema, logo, and social profiles establish site identity for AI systems",
      status: "fail", detail: "Could not fetch homepage to check", weight: 10, isReal: true,
    }
  }

  const html = await res.text()
  const blocks = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) ?? []
  let hasOrg = false, hasLogo = false, hasSameAs = false

  for (const block of blocks) {
    try {
      const obj = JSON.parse(block.replace(/<script[^>]*>/i, "").replace(/<\/script>/i, "").trim())
      const nodes = Array.isArray(obj["@graph"]) ? obj["@graph"] : [obj]
      for (const node of nodes as Array<Record<string, unknown>>) {
        if (node["@type"] === "Organization" || node["@type"] === "WebSite") {
          hasOrg = true
          if (node.logo) hasLogo = true
          if (node.sameAs) hasSameAs = true
        }
      }
    } catch { /* malformed */ }
  }

  const hasSocialLinks = /(twitter\.com|x\.com|linkedin\.com|github\.com|facebook\.com|instagram\.com|youtube\.com)/i.test(html)

  const present = [
    hasOrg && "Organization schema",
    hasLogo && "logo in schema",
    hasSameAs && "sameAs links",
    hasSocialLinks && "social profile links",
  ].filter(Boolean) as string[]

  const missing = [
    !hasOrg && "Organization schema",
    !hasLogo && "logo in schema",
    !hasSameAs && "sameAs links",
    !hasSocialLinks && "social profile links",
  ].filter(Boolean) as string[]

  return {
    id: "authority", category: "Authority", name: "Authority signals",
    description: "Organization schema, logo, and social profiles establish site identity for AI systems",
    status: present.length >= 3 ? "pass" : present.length >= 1 ? "warning" : "fail",
    detail: [
      present.length > 0 ? `Found: ${present.join(", ")}` : null,
      missing.length > 0 ? `Missing: ${missing.join(", ")}` : null,
    ].filter(Boolean).join(" · "),
    recommendation: missing.length > 0
      ? "Add a logo and sameAs social profile URLs to your Organization schema — key authority signals AI uses for entity recognition"
      : undefined,
    weight: 10, isReal: true,
  }
}

async function checkExpertise(origin: string): Promise<CheckResult> {
  const [homeRes, aboutRes, contactRes] = await Promise.all([
    tryFetch(origin),
    tryFetch(`${origin}/about`),
    tryFetch(`${origin}/contact`),
  ])

  const present: string[] = []
  const missing: string[] = []

  if (aboutRes?.ok) present.push("/about page")
  else missing.push("/about page")

  if (contactRes?.ok) present.push("/contact page")
  else missing.push("/contact page")

  if (homeRes?.ok) {
    const html = await homeRes.text()
    if (/name=["']author["']/i.test(html)) present.push("author meta tag")
    else missing.push("author meta tag")

    const blocks = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) ?? []
    const hasPerson = blocks.some((b) => {
      try {
        const obj = JSON.parse(b.replace(/<script[^>]*>/i, "").replace(/<\/script>/i, "").trim())
        const nodes = Array.isArray(obj["@graph"]) ? obj["@graph"] : [obj]
        return (nodes as Array<{ "@type"?: string }>).some((n) => n["@type"] === "Person")
      } catch { return false }
    })
    if (hasPerson) present.push("Person schema")
  }

  return {
    id: "expertise", category: "Authority", name: "Expertise signals",
    description: "About page, author metadata, and Person schema establish credibility for AI citation",
    status: present.length >= 3 ? "pass" : present.length >= 1 ? "warning" : "fail",
    detail: [
      present.length > 0 ? `Found: ${present.join(", ")}` : null,
      missing.length > 0 ? `Missing: ${missing.join(", ")}` : null,
    ].filter(Boolean).join(" · "),
    recommendation: missing.length > 0
      ? "Add an /about page, author meta tags, and Person schema — AI citation systems prioritise sources with identifiable authors"
      : undefined,
    weight: 10, isReal: true,
  }
}

async function checkReputation(origin: string): Promise<CheckResult> {
  const present: string[] = []
  const missing: string[] = []

  if (origin.startsWith("https://")) present.push("HTTPS")
  else missing.push("HTTPS")

  const [homeRes, privacyRes, privacyPolicyRes, termsRes] = await Promise.all([
    tryFetch(origin),
    tryFetch(`${origin}/privacy`),
    tryFetch(`${origin}/privacy-policy`),
    tryFetch(`${origin}/terms`),
  ])

  if (privacyRes?.ok || privacyPolicyRes?.ok) present.push("privacy policy")
  else missing.push("privacy policy")

  if (termsRes?.ok) present.push("terms of service")

  if (homeRes?.ok) {
    const html = await homeRes.text()
    if (/href=["'][^"']*\/contact[^"']*["']/i.test(html)) present.push("contact link")
    else missing.push("contact link")
  }

  return {
    id: "reputation", category: "Authority", name: "Reputation signals",
    description: "HTTPS, privacy policy, and contact pages signal trustworthiness to AI systems",
    status: present.length >= 3 ? "pass" : present.length >= 1 ? "warning" : "fail",
    detail: [
      present.length > 0 ? `Found: ${present.join(", ")}` : null,
      missing.length > 0 ? `Missing: ${missing.join(", ")}` : null,
    ].filter(Boolean).join(" · "),
    recommendation: missing.length > 0
      ? "Serve over HTTPS and add a privacy policy and contact page — these trust signals influence AI citation decisions"
      : undefined,
    weight: 8, isReal: true,
  }
}

async function checkLinkHeaders(origin: string): Promise<CheckResult> {
  const res = await tryFetch(origin)
  if (!res?.ok) {
    return {
      id: "link-headers", category: "Discovery", name: "Link headers (RFC 8288)",
      description: "HTTP Link response headers let agents discover key resources without parsing HTML",
      status: "fail", detail: "Could not fetch response to check headers", weight: 8, isReal: true,
    }
  }

  const linkHeader = res.headers.get("link") ?? ""
  if (!linkHeader) {
    return {
      id: "link-headers", category: "Discovery", name: "Link headers (RFC 8288)",
      description: "HTTP Link response headers let agents discover key resources without parsing HTML",
      status: "warning",
      detail: "No Link header found in HTTP response",
      recommendation: 'Add Link headers to declare key resources — e.g. Link: </llms.txt>; rel="ai-manifest", </openapi.json>; rel="service-desc"',
      weight: 8, isReal: true,
    }
  }

  const rels = [...linkHeader.matchAll(/rel=["']?([^"',;\s>]+)["']?/gi)].map((m) => m[1].toLowerCase())
  const agentRels = ["describedby", "service-desc", "service-document", "hub", "ai-manifest", "llms-txt", "openapi", "mcp", "alternate"]
  const found = rels.filter((r) => agentRels.some((ar) => r.includes(ar)))

  return {
    id: "link-headers", category: "Discovery", name: "Link headers (RFC 8288)",
    description: "HTTP Link response headers let agents discover key resources without parsing HTML",
    status: found.length > 0 ? "pass" : "warning",
    detail: found.length > 0
      ? `Link header present · agent-relevant rels: ${found.join(", ")}`
      : `Link header present but no agent-relevant rels detected (found: ${rels.slice(0, 4).join(", ")})`,
    recommendation: found.length === 0
      ? 'Add agent-relevant rels — e.g. rel="service-desc" for your OpenAPI spec, rel="describedby" for API docs'
      : undefined,
    weight: 8, isReal: true,
  }
}

async function checkApiDiscovery(origin: string): Promise<CheckResult> {
  const paths = [
    "/.well-known/ai-plugin.json",
    "/openapi.json",
    "/openapi.yaml",
    "/swagger.json",
    "/.well-known/openapi.json",
    "/api/openapi.json",
    "/api-docs.json",
  ]
  const responses = await Promise.all(paths.map((p) => tryFetch(`${origin}${p}`)))
  const found = paths.filter((_, i) => responses[i]?.ok)

  if (found.length > 0) {
    const hasPlugin = found.some((p) => p.includes("ai-plugin"))
    const hasOpenApi = found.some((p) => p.includes("openapi") || p.includes("swagger") || p.includes("api-docs"))
    const labels = [hasPlugin && "ai-plugin.json", hasOpenApi && "OpenAPI spec"].filter(Boolean) as string[]
    return {
      id: "api-discovery", category: "Discovery", name: "API & skill discovery",
      description: "Machine-readable API specs let AI agents discover and call your site's capabilities",
      status: "pass",
      detail: `Found: ${labels.join(", ")} at ${found.slice(0, 2).join(", ")}`,
      weight: 10, isReal: true,
    }
  }

  return {
    id: "api-discovery", category: "Discovery", name: "API & skill discovery",
    description: "Machine-readable API specs let AI agents discover and call your site's capabilities",
    status: "info",
    detail: "No OpenAPI spec or ai-plugin.json found at common paths",
    recommendation: "Expose an OpenAPI spec at /openapi.json and optionally /.well-known/ai-plugin.json so AI agents can discover your API capabilities",
    weight: 10, isReal: true,
  }
}

async function checkAuthDiscovery(origin: string): Promise<CheckResult> {
  const paths = [
    "/.well-known/openid-configuration",
    "/.well-known/oauth-authorization-server",
    "/.well-known/oauth-protected-resource",
  ]
  const responses = await Promise.all(paths.map((p) => tryFetch(`${origin}${p}`)))
  const found = paths.filter((_, i) => responses[i]?.ok)

  if (found.length > 0) {
    const labels = found.map((p) => {
      if (p.includes("openid")) return "OIDC discovery"
      if (p.includes("authorization-server")) return "OAuth AS metadata"
      return "OAuth resource metadata"
    })
    return {
      id: "auth-discovery", category: "Access", name: "OAuth / OIDC discovery",
      description: "Standard auth discovery endpoints let AI agents negotiate authentication automatically",
      status: "pass",
      detail: `Found: ${labels.join(", ")}`,
      weight: 8, isReal: true,
    }
  }

  return {
    id: "auth-discovery", category: "Access", name: "OAuth / OIDC discovery",
    description: "Standard auth discovery endpoints let AI agents negotiate authentication automatically",
    status: "info",
    detail: "No OAuth/OIDC discovery endpoints found at /.well-known/openid-configuration or /.well-known/oauth-authorization-server",
    recommendation: "If AI agents need to authenticate with your service, publish OAuth/OIDC metadata at standard /.well-known/ paths so agents can auto-configure auth flows",
    weight: 8, isReal: true,
  }
}

async function checkMcpServerCard(origin: string): Promise<CheckResult> {
  const paths = ["/.well-known/mcp.json", "/mcp.json", "/.well-known/mcp"]
  const [homeRes, ...mcpResponses] = await Promise.all([
    tryFetch(origin),
    ...paths.map((p) => tryFetch(`${origin}${p}`)),
  ])

  const hitIndex = mcpResponses.findIndex((r) => r?.ok)
  if (hitIndex !== -1) {
    let detail = `MCP server card found at ${paths[hitIndex]}`
    try {
      const json = await mcpResponses[hitIndex]!.json()
      if (typeof json.name === "string") detail += ` · name: ${json.name}`
      if (Array.isArray(json.tools)) detail += ` · ${json.tools.length} tool${json.tools.length !== 1 ? "s" : ""}`
    } catch { /* not parseable JSON */ }
    return {
      id: "mcp-server-card", category: "Discovery", name: "MCP server card",
      description: "A server card at /.well-known/mcp.json declares what tools your site exposes to AI agents",
      status: "pass", detail,
      weight: 10, isReal: true,
    }
  }

  if (homeRes?.ok) {
    const link = homeRes.headers.get("link") ?? ""
    if (/mcp/i.test(link)) {
      return {
        id: "mcp-server-card", category: "Discovery", name: "MCP server card",
        description: "A server card at /.well-known/mcp.json declares what tools your site exposes to AI agents",
        status: "pass", detail: "MCP reference found in Link response header",
        weight: 10, isReal: true,
      }
    }
  }

  return {
    id: "mcp-server-card", category: "Discovery", name: "MCP server card",
    description: "A server card at /.well-known/mcp.json declares what tools your site exposes to AI agents",
    status: "info",
    detail: "No MCP server card found at /.well-known/mcp.json",
    recommendation: "If your site exposes tools for AI agents via MCP, publish a server card at /.well-known/mcp.json describing your tools and capabilities",
    weight: 10, isReal: true,
  }
}

async function checkHelpfulContent(origin: string): Promise<CheckResult> {
  const paths = ["/blog", "/articles", "/guides", "/resources", "/learn", "/tutorials", "/news", "/insights"]
  const responses = await Promise.all(paths.map((p) => tryFetch(`${origin}${p}`)))
  const found = paths.filter((_, i) => responses[i]?.ok)

  if (found.length > 0) {
    return {
      id: "helpful-content", category: "Content", name: "Helpful content hub",
      description: "A blog or resource section gives AI systems authoritative content to cite from your domain",
      status: found.length >= 2 ? "pass" : "warning",
      detail: `Content section${found.length > 1 ? "s" : ""} found: ${found.join(", ")}`,
      weight: 10, isReal: true,
    }
  }

  return {
    id: "helpful-content", category: "Content", name: "Helpful content hub",
    description: "A blog or resource section gives AI systems authoritative content to cite from your domain",
    status: "fail",
    detail: "No blog, guide, or resource section detected at common paths (/blog, /articles, /guides, /resources)",
    recommendation: "Create a /blog or /guides section with in-depth content AI can reference when answering user queries about your topic area",
    weight: 10, isReal: true,
  }
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

  const [
    llmsTxt, robotsTxt, sitemap, knowledgeHub, apiAccess, markdownRepr,
    homepageChecks, sitewideSEO,
    cleanStructure, performance, freshContent, internalLinking,
    authority, expertise, reputation, helpfulContent,
    linkHeaders, apiDiscovery, authDiscovery, mcpServerCard,
  ] = await Promise.all([
    checkLlmsTxt(origin),
    checkRobotsTxt(origin),
    checkSitemap(origin),
    checkKnowledgeHub(origin),
    checkApiAccess(origin),
    checkMarkdownRepresentation(origin),
    checkHomepage(origin),
    checkSitewideSEO(origin),
    checkCleanStructure(origin),
    checkPerformance(origin),
    checkFreshContent(origin),
    checkInternalLinking(origin),
    checkAuthority(origin),
    checkExpertise(origin),
    checkReputation(origin),
    checkHelpfulContent(origin),
    checkLinkHeaders(origin),
    checkApiDiscovery(origin),
    checkAuthDiscovery(origin),
    checkMcpServerCard(origin),
  ])

  const checks: CheckResult[] = [
    // Discovery / Crawlable HTML
    llmsTxt,
    robotsTxt,
    sitemap,
    markdownRepr,
    linkHeaders,
    mcpServerCard,
    apiDiscovery,
    // Content
    helpfulContent,
    knowledgeHub,
    freshContent,
    // Structure
    cleanStructure,
    internalLinking,
    // Metadata + SEO
    ...homepageChecks,
    ...sitewideSEO,
    // Performance
    performance,
    // Authority
    authority,
    expertise,
    reputation,
    // Access
    authDiscovery,
    apiAccess,
  ]

  return NextResponse.json({ checks })
}