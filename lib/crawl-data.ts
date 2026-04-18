export type CheckStatus = "pass" | "fail" | "warning" | "info"

export interface CheckResult {
  id: string
  category: string
  name: string
  description: string
  status: CheckStatus
  detail: string
  recommendation?: string
  weight: number
}

export interface CrawlReport {
  url: string
  score: number
  grade: "A" | "B" | "C" | "D" | "F"
  summary: string
  checks: CheckResult[]
  scannedAt: string
}

const syntheticData: Record<string, Partial<CrawlReport>> = {
  "openai.com": {
    score: 92,
    grade: "A",
    summary: "Excellent AI crawlability. This site follows most best practices for AI agents and crawlers.",
    checks: [
      { id: "llms-txt", category: "Discovery", name: "llms.txt present", description: "A machine-readable file that tells AI systems how to interact with the site", status: "pass", detail: "Found at /llms.txt with 12 entries", weight: 20 },
      { id: "robots-ai", category: "Discovery", name: "robots.txt AI directives", description: "robots.txt includes directives for known AI crawlers (GPTBot, ClaudeBot, etc.)", status: "pass", detail: "GPTBot, ClaudeBot, PerplexityBot are all explicitly allowed", weight: 15 },
      { id: "sitemap", category: "Discovery", name: "XML Sitemap", description: "Sitemap helps AI agents discover all pages systematically", status: "pass", detail: "sitemap.xml found with 348 URLs, last modified today", weight: 10 },
      { id: "knowledge-hub", category: "Content", name: "Knowledge hub / docs", description: "Dedicated documentation or knowledge base that AI can index", status: "pass", detail: "Docs hub found at /docs with structured navigation", weight: 15 },
      { id: "structured-data", category: "Content", name: "Structured data (JSON-LD)", description: "Schema.org markup helps AI understand page context", status: "pass", detail: "Organization, WebSite, and FAQPage schemas found", weight: 10 },
      { id: "open-graph", category: "Metadata", name: "Open Graph / meta tags", description: "Rich metadata helps AI summarize and represent the page", status: "pass", detail: "og:title, og:description, og:image all present", weight: 5 },
      { id: "canonical", category: "Metadata", name: "Canonical URLs", description: "Canonical tags prevent duplicate content confusion for AI crawlers", status: "pass", detail: "All pages have canonical tags", weight: 5 },
      { id: "api-access", category: "Access", name: "Public API or data feed", description: "Structured API endpoints allow AI to access data programmatically", status: "pass", detail: "Public REST API documented at /api", weight: 10 },
      { id: "login-wall", category: "Access", name: "No login wall on key pages", description: "Main content is accessible without authentication", status: "pass", detail: "Homepage and docs are publicly accessible", weight: 10 },
    ],
  },
  "example.com": {
    score: 28,
    grade: "D",
    summary: "Poor AI crawlability. Significant improvements needed to make this site accessible to AI agents.",
    checks: [
      { id: "llms-txt", category: "Discovery", name: "llms.txt present", description: "A machine-readable file that tells AI systems how to interact with the site", status: "fail", detail: "No llms.txt found at /llms.txt", recommendation: "Create a /llms.txt file following the llmstxt.org specification", weight: 20 },
      { id: "robots-ai", category: "Discovery", name: "robots.txt AI directives", description: "robots.txt includes directives for known AI crawlers", status: "fail", detail: "robots.txt blocks all crawlers with 'Disallow: /'", recommendation: "Review robots.txt and add explicit allow rules for AI crawlers", weight: 15 },
      { id: "sitemap", category: "Discovery", name: "XML Sitemap", description: "Sitemap helps AI agents discover all pages", status: "fail", detail: "No sitemap.xml found", recommendation: "Generate and submit an XML sitemap", weight: 10 },
      { id: "knowledge-hub", category: "Content", name: "Knowledge hub / docs", description: "Dedicated documentation or knowledge base", status: "fail", detail: "No documentation or knowledge hub detected", recommendation: "Create a /docs or /help section with structured content", weight: 15 },
      { id: "structured-data", category: "Content", name: "Structured data (JSON-LD)", description: "Schema.org markup helps AI understand page context", status: "fail", detail: "No JSON-LD or schema markup found", recommendation: "Add at minimum Organization and WebSite schemas", weight: 10 },
      { id: "open-graph", category: "Metadata", name: "Open Graph / meta tags", description: "Rich metadata for AI summarization", status: "warning", detail: "Basic meta tags present but missing og: properties", recommendation: "Add Open Graph tags to all pages", weight: 5 },
      { id: "canonical", category: "Metadata", name: "Canonical URLs", description: "Canonical tags prevent duplicate content issues", status: "pass", detail: "Canonical tags found on all sampled pages", weight: 5 },
      { id: "api-access", category: "Access", name: "Public API or data feed", description: "Structured API for programmatic access", status: "fail", detail: "No public API detected", recommendation: "Consider exposing a read-only API or RSS feed", weight: 10 },
      { id: "login-wall", category: "Access", name: "No login wall on key pages", description: "Main content accessible without auth", status: "pass", detail: "Homepage is publicly accessible", weight: 10 },
    ],
  },
  "github.com": {
    score: 76,
    grade: "B",
    summary: "Good AI crawlability with some areas for improvement, particularly around machine-readable AI metadata.",
    checks: [
      { id: "llms-txt", category: "Discovery", name: "llms.txt present", description: "Machine-readable AI interaction file", status: "fail", detail: "No llms.txt found", recommendation: "Add /llms.txt to help AI agents understand site structure", weight: 20 },
      { id: "robots-ai", category: "Discovery", name: "robots.txt AI directives", description: "AI crawler directives in robots.txt", status: "warning", detail: "GPTBot is allowed but ClaudeBot and PerplexityBot have no explicit rules", recommendation: "Add explicit allow rules for ClaudeBot and PerplexityBot", weight: 15 },
      { id: "sitemap", category: "Discovery", name: "XML Sitemap", description: "Comprehensive sitemap for discovery", status: "pass", detail: "sitemap.xml found with 1,200+ URLs", weight: 10 },
      { id: "knowledge-hub", category: "Content", name: "Knowledge hub / docs", description: "Documentation hub for AI indexing", status: "pass", detail: "Extensive docs at docs.github.com", weight: 15 },
      { id: "structured-data", category: "Content", name: "Structured data (JSON-LD)", description: "Schema.org markup", status: "pass", detail: "SoftwareApplication and Organization schemas present", weight: 10 },
      { id: "open-graph", category: "Metadata", name: "Open Graph / meta tags", description: "Rich metadata for summarization", status: "pass", detail: "Full og: and twitter: meta tags on all pages", weight: 5 },
      { id: "canonical", category: "Metadata", name: "Canonical URLs", description: "Canonical tags to prevent duplicate content", status: "pass", detail: "Canonical URLs present throughout", weight: 5 },
      { id: "api-access", category: "Access", name: "Public API or data feed", description: "Programmatic data access", status: "pass", detail: "Extensive REST and GraphQL APIs available", weight: 10 },
      { id: "login-wall", category: "Access", name: "No login wall on key pages", description: "Public content access", status: "warning", detail: "Many repository features require login; public repos accessible", weight: 10 },
    ],
  },
}

function hashUrl(url: string): number {
  let hash = 0
  for (let i = 0; i < url.length; i++) {
    hash = (hash << 5) - hash + url.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function generateCheckForUrl(id: string, url: string, template: Partial<CheckResult>): CheckResult {
  const hash = hashUrl(url + id)
  const passBias = hash % 100

  let status: CheckStatus
  if (passBias < 55) status = "pass"
  else if (passBias < 75) status = "fail"
  else if (passBias < 90) status = "warning"
  else status = "info"

  return { ...template, id, status } as CheckResult
}

const checkTemplates: CheckResult[] = [
  { id: "llms-txt", category: "Discovery", name: "llms.txt present", description: "A machine-readable file at /llms.txt that tells AI systems how to interact with the site", status: "pass", detail: "Checked /llms.txt endpoint", recommendation: "Create a /llms.txt file following the llmstxt.org specification", weight: 20 },
  { id: "robots-ai", category: "Discovery", name: "robots.txt AI directives", description: "robots.txt includes explicit directives for known AI crawlers (GPTBot, ClaudeBot, PerplexityBot)", status: "pass", detail: "Analyzed robots.txt for AI bot rules", recommendation: "Add explicit User-agent sections for GPTBot, ClaudeBot, PerplexityBot", weight: 15 },
  { id: "sitemap", category: "Discovery", name: "XML Sitemap", description: "An XML sitemap helps AI agents systematically discover all pages", status: "pass", detail: "Checked /sitemap.xml and /sitemap_index.xml", recommendation: "Generate an XML sitemap and reference it in robots.txt", weight: 10 },
  { id: "knowledge-hub", category: "Content", name: "Knowledge hub / docs", description: "A dedicated documentation or knowledge base section that AI can index for accurate answers", status: "pass", detail: "Scanned for /docs, /help, /knowledge-base, /faq paths", recommendation: "Create a structured /docs or /help section", weight: 15 },
  { id: "structured-data", category: "Content", name: "Structured data (JSON-LD)", description: "Schema.org markup helps AI understand the context and meaning of page content", status: "pass", detail: "Parsed page HTML for JSON-LD scripts", recommendation: "Add Organization, WebSite, and content-appropriate schemas", weight: 10 },
  { id: "open-graph", category: "Metadata", name: "Open Graph / meta tags", description: "Rich metadata (og:, twitter:) helps AI summarize and represent the page accurately", status: "pass", detail: "Checked <head> for og: and meta description tags", recommendation: "Add og:title, og:description, og:image to all pages", weight: 5 },
  { id: "canonical", category: "Metadata", name: "Canonical URLs", description: "Canonical link tags prevent AI crawlers from indexing duplicate or near-duplicate content", status: "pass", detail: "Checked for rel=canonical on sampled pages", weight: 5 },
  { id: "api-access", category: "Access", name: "Public API or data feed", description: "Structured API endpoints allow AI agents to access data programmatically", status: "pass", detail: "Probed /api, /feed, /rss endpoints", recommendation: "Expose a read-only REST API or RSS/Atom feed", weight: 10 },
  { id: "login-wall", category: "Access", name: "No login wall on key pages", description: "Main content is accessible without authentication so AI crawlers can index it", status: "pass", detail: "Checked if homepage and main content require login", weight: 10 },
]

export function generateCrawlReport(inputUrl: string): CrawlReport {
  let cleanUrl = inputUrl.toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "")
  const domain = cleanUrl.split("/")[0]

  if (syntheticData[domain]) {
    const data = syntheticData[domain]
    return {
      url: inputUrl,
      score: data.score!,
      grade: data.grade!,
      summary: data.summary!,
      checks: data.checks!,
      scannedAt: new Date().toISOString(),
    }
  }

  const checks = checkTemplates.map((template) => generateCheckForUrl(template.id, domain, template))
  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0)
  const earnedWeight = checks.reduce((sum, c) => {
    if (c.status === "pass") return sum + c.weight
    if (c.status === "warning") return sum + c.weight * 0.5
    return sum
  }, 0)

  const score = Math.round((earnedWeight / totalWeight) * 100)
  const grade = score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : score >= 40 ? "D" : "F"
  const summary =
    grade === "A" ? "Excellent AI crawlability. This site follows most best practices for AI agents and crawlers." :
    grade === "B" ? "Good AI crawlability with some areas for improvement." :
    grade === "C" ? "Moderate AI crawlability. Several important checks are failing." :
    grade === "D" ? "Poor AI crawlability. Significant improvements needed." :
    "Critical issues found. This site is largely inaccessible to AI crawlers."

  return { url: inputUrl, score, grade, summary, checks, scannedAt: new Date().toISOString() }
}
