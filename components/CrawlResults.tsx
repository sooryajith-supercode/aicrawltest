"use client"

import { CheckResult, CrawlReport, CheckStatus } from "@/lib/crawl-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Globe,
  FileText,
  Database,
  Tag,
  Lock,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"

function statusIcon(status: CheckStatus) {
  switch (status) {
    case "pass": return <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
    case "fail": return <XCircle className="h-5 w-5 text-red-500 shrink-0" />
    case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
    case "info": return <Info className="h-5 w-5 text-blue-500 shrink-0" />
  }
}

function statusBadge(status: CheckStatus) {
  const variants: Record<CheckStatus, "success" | "error" | "warning" | "secondary"> = {
    pass: "success",
    fail: "error",
    warning: "warning",
    info: "secondary",
  }
  const labels: Record<CheckStatus, string> = {
    pass: "Pass",
    fail: "Fail",
    warning: "Warning",
    info: "Info",
  }
  return <Badge variant={variants[status]}>{labels[status]}</Badge>
}

function categoryIcon(category: string) {
  switch (category) {
    case "Discovery": return <Globe className="h-4 w-4" />
    case "Content": return <FileText className="h-4 w-4" />
    case "Metadata": return <Tag className="h-4 w-4" />
    case "Access": return <Lock className="h-4 w-4" />
    default: return <Database className="h-4 w-4" />
  }
}

function gradeColor(grade: string) {
  switch (grade) {
    case "A": return "text-green-600"
    case "B": return "text-blue-600"
    case "C": return "text-yellow-600"
    case "D": return "text-orange-600"
    case "F": return "text-red-600"
    default: return "text-gray-600"
  }
}

function scoreRingColor(score: number) {
  if (score >= 90) return "#16a34a"
  if (score >= 75) return "#2563eb"
  if (score >= 60) return "#ca8a04"
  if (score >= 40) return "#ea580c"
  return "#dc2626"
}

function CheckRow({ check }: { check: CheckResult }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        {statusIcon(check.status)}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-gray-900">{check.name}</span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              {categoryIcon(check.category)}
              {check.category}
            </span>
          </div>
          <p className="text-sm text-gray-500 truncate">{check.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {statusBadge(check.status)}
          {open ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-0 bg-gray-50 border-t">
          <p className="text-sm text-gray-700 mt-3"><span className="font-medium">Finding: </span>{check.detail}</p>
          {check.recommendation && (
            <div className="mt-2 flex gap-2 items-start">
              <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <p className="text-sm text-blue-700"><span className="font-medium">Recommendation: </span>{check.recommendation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function CrawlResults({ report }: { report: CrawlReport }) {
  const categories = Array.from(new Set(report.checks.map((c) => c.category)))
  const passCnt = report.checks.filter((c) => c.status === "pass").length
  const failCnt = report.checks.filter((c) => c.status === "fail").length
  const warnCnt = report.checks.filter((c) => c.status === "warning").length
  const circumference = 2 * Math.PI * 40
  const strokeDash = (report.score / 100) * circumference

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Score header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Score ring */}
            <div className="relative flex items-center justify-center shrink-0">
              <svg width="100" height="100" className="-rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke={scoreRingColor(report.score)}
                  strokeWidth="8"
                  strokeDasharray={`${strokeDash} ${circumference}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className={`text-2xl font-bold ${gradeColor(report.grade)}`}>{report.grade}</span>
                <span className="text-xs text-gray-500">{report.score}/100</span>
              </div>
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl mb-1 break-all">{report.url}</CardTitle>
              <CardDescription className="text-sm">{report.summary}</CardDescription>
              <div className="flex flex-wrap gap-3 mt-3">
                <span className="flex items-center gap-1 text-sm text-green-600"><CheckCircle2 className="h-4 w-4" />{passCnt} passed</span>
                <span className="flex items-center gap-1 text-sm text-red-600"><XCircle className="h-4 w-4" />{failCnt} failed</span>
                <span className="flex items-center gap-1 text-sm text-yellow-600"><AlertTriangle className="h-4 w-4" />{warnCnt} warnings</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Overall AI Crawlability Score</span>
              <span className="font-medium">{report.score}%</span>
            </div>
            <Progress value={report.score} className="h-3" />
          </div>
          <p className="text-xs text-gray-400 mt-3">Scanned at {new Date(report.scannedAt).toLocaleString()}</p>
        </CardContent>
      </Card>

      {/* Checks by category */}
      {categories.map((cat) => {
        const catChecks = report.checks.filter((c) => c.category === cat)
        const catPass = catChecks.filter((c) => c.status === "pass").length
        return (
          <Card key={cat}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {categoryIcon(cat)}
                  <CardTitle className="text-lg">{cat}</CardTitle>
                </div>
                <span className="text-sm text-gray-500">{catPass}/{catChecks.length} passed</span>
              </div>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <div className="space-y-3">
                {catChecks.map((check) => (
                  <CheckRow key={check.id} check={check} />
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* What is AI crawlability */}
      <Card className="bg-blue-50 border-blue-100">
        <CardHeader>
          <CardTitle className="text-base text-blue-800">What is AI Crawlability?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-700">
            AI crawlability measures how well a website can be discovered, indexed, and understood by AI systems like
            ChatGPT, Claude, Perplexity, and other AI-powered search engines. As AI becomes a primary way people find
            information, ensuring your site is AI-friendly is critical for visibility and reach.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
