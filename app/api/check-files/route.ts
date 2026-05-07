import { NextRequest, NextResponse } from "next/server"

const USER_AGENT = "AI-Crawlability-Bot/1.0 (+https://aicrawltest.vercel.app)"
const TIMEOUT_MS = 7000

async function tryFetch(url: string): Promise<Response | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": USER_AGENT, Accept: "*/*" },
      redirect: "follow",
    })
    clearTimeout(timer)
    return res
  } catch {
    clearTimeout(timer)
    return null
  }
}

// Extract Sitemap: URLs declared in robots.txt
function parseSitemapUrls(robotsText: string): string[] {
  return robotsText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.toLowerCase().startsWith("sitemap:"))
    .map((line) => line.slice("sitemap:".length).trim())
    .filter((u) => {
      try { new URL(u); return true } catch { return false }
    })
}

function parseRobotsDirectives(robotsText: string) {
  const lines = robotsText.split("\n").map((l) => l.trim().toLowerCase())
  return {
    userAgentStar: lines.some((l) => l === "user-agent: *" || l === "user-agent:*"),
    hasDisallow: lines.some((l) => l.startsWith("disallow:")),
    hasAllow: lines.some((l) => l.startsWith("allow:") && !l.startsWith("disallow:")),
    hasSitemap: lines.some((l) => l.startsWith("sitemap:")),
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

  // Common sitemap paths to probe in parallel alongside other checks
  const SITEMAP_PATHS = [
    "/sitemap.xml",
    "/sitemap_index.xml",
    "/sitemap/sitemap.xml",
  ]

  const [llmsMain, llmsWellKnown, robotsRes, ...sitemapResponses] = await Promise.all([
    tryFetch(`${origin}/llms.txt`),
    tryFetch(`${origin}/.well-known/llms.txt`),
    tryFetch(`${origin}/robots.txt`),
    ...SITEMAP_PATHS.map((p) => tryFetch(`${origin}${p}`)),
  ])

  // Check robots.txt-declared sitemaps if none of the common paths matched
  let sitemapFound = false
  let sitemapUrl = `${origin}/sitemap.xml`
  let robotsDirectives: { userAgentStar: boolean; hasDisallow: boolean; hasAllow: boolean; hasSitemap: boolean } | null = null
  let robotsText = ""

  if (robotsRes?.ok) {
    try {
      robotsText = await robotsRes.text()
      robotsDirectives = parseRobotsDirectives(robotsText)
    } catch {
      // robots.txt unreadable — fall through
    }
  }

  const directHitIndex = sitemapResponses.findIndex((r) => r?.ok)
  if (directHitIndex !== -1) {
    sitemapFound = true
    sitemapUrl = `${origin}${SITEMAP_PATHS[directHitIndex]}`
  } else if (robotsText) {
    try {
      const declared = parseSitemapUrls(robotsText)
      if (declared.length > 0) {
        const checks = await Promise.all(declared.map((u) => tryFetch(u)))
        const hit = checks.findIndex((r) => r?.ok)
        if (hit !== -1) {
          sitemapFound = true
          sitemapUrl = declared[hit]
        }
      }
    } catch {
      // fall through
    }
  }

  const llmsFound = llmsMain?.ok || llmsWellKnown?.ok
  const llmsUrl = llmsMain?.ok
    ? `${origin}/llms.txt`
    : llmsWellKnown?.ok
    ? `${origin}/.well-known/llms.txt`
    : `${origin}/llms.txt`

  // Per-page markdown check — fetch real page HTML and look for link tag
  const pageMarkdown = await checkPageMarkdown(origin, sitemapFound ? sitemapUrl : null)

  return NextResponse.json({
    llmsTxt: { found: llmsFound, url: llmsUrl },
    robotsTxt: { found: robotsRes?.ok ?? false, url: `${origin}/robots.txt`, directives: robotsDirectives },
    sitemapXml: { found: sitemapFound, url: sitemapUrl },
    pageMarkdown,
  })
}

function extractSitemapPageUrls(xmlText: string): string[] {
  const matches = xmlText.match(/<loc>([^<]+)<\/loc>/gi) ?? []
  return matches
    .map((m) => m.replace(/<\/?loc>/gi, "").trim())
    .filter((u) => {
      try {
        const p = new URL(u)
        return !p.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|mp4|pdf)$/i)
      } catch { return false }
    })
}

// Find <link rel="alternate" type="text/markdown" href="..."> in HTML
function findMarkdownLinkTag(html: string): string | null {
  const head = html.slice(0, 15000) // only need the <head>
  const linkTagRegex = /<link\s[^>]+>/gi
  let match: RegExpExecArray | null
  while ((match = linkTagRegex.exec(head)) !== null) {
    const tag = match[0]
    if (/type=["']text\/markdown["']/i.test(tag)) {
      const href = tag.match(/href=["']([^"']+)["']/i)
      if (href) return href[1]
    }
  }
  return null
}

async function checkPageMarkdown(origin: string, sitemapUrl: string | null): Promise<{
  checked: number
  found: number
  pages: Array<{ url: string; markdownUrl: string; found: boolean }>
}> {
  // Always check the homepage; pick one more page from the sitemap
  const pagesToCheck: string[] = [`${origin}/`]

  if (sitemapUrl) {
    try {
      const res = await tryFetch(sitemapUrl)
      if (res?.ok) {
        const xml = await res.text()
        const allUrls = extractSitemapPageUrls(xml)
        const nonRoot = allUrls.find((u) => {
          try { return new URL(u).pathname !== "/" } catch { return false }
        })
        if (nonRoot) pagesToCheck.push(nonRoot)
      }
    } catch { /* fall through */ }
  }

  // Fetch HTML for each page in parallel
  const htmlResponses = await Promise.all(pagesToCheck.map((u) => tryFetch(u)))

  const pages = await Promise.all(
    pagesToCheck.map(async (pageUrl, i) => {
      const res = htmlResponses[i]
      if (!res?.ok) return { url: pageUrl, markdownUrl: "", found: false }
      try {
        const html = await res.text()
        const href = findMarkdownLinkTag(html)
        if (href) {
          const markdownUrl = href.startsWith("http") ? href : `${origin}${href}`
          return { url: pageUrl, markdownUrl, found: true }
        }
      } catch { /* fall through */ }
      return { url: pageUrl, markdownUrl: "", found: false }
    })
  )

  return {
    checked: pages.length,
    found: pages.filter((p) => p.found).length,
    pages,
  }
}
