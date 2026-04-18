import { NextRequest, NextResponse } from "next/server"
import type { CheckResult } from "@/lib/crawl-data"

const USER_AGENT = "AI-Crawlability-Bot/1.0 (+https://aicrawltest.vercel.app)"
const FETCH_TIMEOUT_MS = 7000
const MAX_BODY_BYTES = 100_000 // 100 KB ceiling

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/plain, text/*;q=0.9, */*;q=0.8",
      },
      redirect: "follow",
    })
  } finally {
    clearTimeout(timer)
  }
}

interface ParsedLlms {
  hasTitle: boolean
  hasDescription: boolean
  sections: number
  entries: number
  sizeBytes: number
  firstLine: string
}

function parseLlmsTxt(raw: string): ParsedLlms {
  const lines = raw.split("\n").map((l) => l.trim())
  const nonEmpty = lines.filter(Boolean)

  return {
    hasTitle: nonEmpty.some((l) => /^#\s+\S/.test(l) && !l.startsWith("##")),
    hasDescription: nonEmpty.some((l) => l.startsWith("> ")),
    sections: nonEmpty.filter((l) => l.startsWith("## ")).length,
    entries: nonEmpty.filter((l) => /^-\s+\[.+?\]\(.+?\)/.test(l)).length,
    sizeBytes: new TextEncoder().encode(raw).length,
    firstLine: nonEmpty[0] ?? "",
  }
}

function buildDetail(url: string, p: ParsedLlms): string {
  const parts: string[] = [`Found at ${url}`]

  if (p.entries > 0)
    parts.push(`${p.entries} entr${p.entries === 1 ? "y" : "ies"}`)
  if (p.sections > 0)
    parts.push(`${p.sections} section${p.sections === 1 ? "" : "s"}`)

  parts.push(`${(p.sizeBytes / 1024).toFixed(1)} KB`)

  const structureNotes: string[] = []
  if (!p.hasTitle) structureNotes.push("missing # title")
  if (!p.hasDescription) structureNotes.push("missing > description")
  if (structureNotes.length)
    parts.push(`Incomplete spec format: ${structureNotes.join(", ")}`)
  else parts.push("Properly structured")

  return parts.join(" · ")
}

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url")
  if (!rawUrl) {
    return NextResponse.json({ error: "url param required" }, { status: 400 })
  }

  let origin: string
  try {
    const parsed = new URL(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`)
    origin = `${parsed.protocol}//${parsed.hostname}`
  } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 })
  }

  // Try canonical path, then .well-known fallback
  const candidates = [
    `${origin}/llms.txt`,
    `${origin}/.well-known/llms.txt`,
  ]

  for (const candidate of candidates) {
    try {
      const res = await fetchWithTimeout(candidate)

      if (!res.ok) continue

      const ct = res.headers.get("content-type") ?? ""
      // Accept text/* or binary streams (some servers misconfigure content-type)
      if (ct && !ct.includes("text") && !ct.includes("octet-stream") && !ct.includes("plain")) continue

      // Guard against huge files
      const raw = await res.text()
      const capped = raw.slice(0, MAX_BODY_BYTES)

      const parsed = parseLlmsTxt(capped)
      const detail = buildDetail(candidate, parsed)

      const result: Partial<CheckResult> = {
        status: "pass",
        detail,
      }
      return NextResponse.json(result)
    } catch {
      // Timeout, DNS failure, SSL error — try next candidate
    }
  }

  // Nothing found
  const hostname = new URL(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`).hostname
  const result: Partial<CheckResult> = {
    status: "fail",
    detail: `No llms.txt found at ${origin}/llms.txt`,
    recommendation: `Create /${hostname}/llms.txt following the llmstxt.org spec — include a # title, > description, and ## sections with linked resources so AI systems can understand your site.`,
  }
  return NextResponse.json(result)
}
