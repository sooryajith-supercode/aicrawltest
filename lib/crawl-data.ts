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
  /** true when the result came from a live network request */
  isReal?: boolean
}

export interface CrawlReport {
  url: string
  score: number
  grade: "A" | "B" | "C" | "D" | "F"
  summary: string
  checks: CheckResult[]
  scannedAt: string
}

export function buildCrawlReport(url: string, checks: CheckResult[]): CrawlReport {
  const totalWeight = checks.reduce((s, c) => s + c.weight, 0)
  const earned = checks.reduce((s, c) => {
    if (c.status === "pass") return s + c.weight
    if (c.status === "warning") return s + c.weight * 0.5
    return s
  }, 0)

  const score = totalWeight > 0 ? Math.round((earned / totalWeight) * 100) : 0
  const grade: CrawlReport["grade"] =
    score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : score >= 40 ? "D" : "F"

  const summary =
    grade === "A" ? "Excellent AI crawlability. This site follows most best practices for AI agents and crawlers." :
    grade === "B" ? "Good AI crawlability with some areas for improvement." :
    grade === "C" ? "Moderate AI crawlability. Several important checks are failing." :
    grade === "D" ? "Poor AI crawlability. Significant improvements needed." :
    "Critical issues found. This site is largely inaccessible to AI crawlers."

  return { url, score, grade, summary, checks, scannedAt: new Date().toISOString() }
}
