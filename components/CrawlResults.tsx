"use client"

import { useState } from "react"
import { CheckResult, CrawlReport, CheckStatus } from "@/lib/crawl-data"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Globe,
  FileText,
  Tag,
  Lock,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

/* ── Helpers ─────────────────────────────────────── */

function statusIcon(status: CheckStatus) {
  const cls = "h-[18px] w-[18px] shrink-0"
  switch (status) {
    case "pass":    return <CheckCircle2 className={cls} style={{ color: "#3a7c52" }} />
    case "fail":    return <XCircle      className={cls} style={{ color: "#b53333" }} />
    case "warning": return <AlertTriangle className={cls} style={{ color: "#8a6a1a" }} />
    case "info":    return <Info         className={cls} style={{ color: "#5e5d59" }} />
  }
}

function liveBadge() {
  return (
    <span
      className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider"
      style={{ backgroundColor: "rgba(58,124,82,0.10)", color: "#3a7c52" }}
    >
      Live
    </span>
  )
}

function statusPill(status: CheckStatus) {
  const map: Record<CheckStatus, { bg: string; text: string; label: string }> = {
    pass:    { bg: "rgba(58,124,82,0.10)",  text: "#3a7c52", label: "Pass"    },
    fail:    { bg: "rgba(181,51,51,0.10)",  text: "#b53333", label: "Fail"    },
    warning: { bg: "rgba(138,106,26,0.10)", text: "#8a6a1a", label: "Warning" },
    info:    { bg: "rgba(94,93,89,0.10)",   text: "#5e5d59", label: "Info"    },
  }
  const s = map[status]
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  )
}

function categoryIcon(category: string) {
  const cls = "h-4 w-4 shrink-0"
  switch (category) {
    case "Discovery": return <Globe    className={cls} />
    case "Content":   return <FileText className={cls} />
    case "Metadata":  return <Tag      className={cls} />
    case "Access":    return <Lock     className={cls} />
    default:          return <Info     className={cls} />
  }
}

function gradeStyle(grade: string): { color: string } {
  const colors: Record<string, string> = {
    A: "#3a7c52", B: "#3d6b9e", C: "#8a6a1a", D: "#c96442", F: "#b53333",
  }
  return { color: colors[grade] ?? "#141413" }
}

function scoreRingColor(score: number) {
  if (score >= 90) return "#3a7c52"
  if (score >= 75) return "#3d6b9e"
  if (score >= 60) return "#8a6a1a"
  if (score >= 40) return "#c96442"
  return "#b53333"
}

/* ── CheckRow ────────────────────────────────────── */

function CheckRow({ check }: { check: CheckResult }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="rounded-[8px] overflow-hidden"
      style={{ border: "1px solid #f0eee6" }}
    >
      <button
        className="w-full flex items-start gap-3 p-4 text-left transition-colors"
        style={{ backgroundColor: open ? "#f5f4ed" : "transparent" }}
        onMouseEnter={(e) => { if (!open) e.currentTarget.style.backgroundColor = "#fdfcf8" }}
        onMouseLeave={(e) => { if (!open) e.currentTarget.style.backgroundColor = "transparent" }}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="mt-0.5">{statusIcon(check.status)}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-0.5">
            <span className="text-sm font-medium" style={{ color: "#141413" }}>{check.name}</span>
            {check.isReal && liveBadge()}
            <span className="flex items-center gap-1 text-xs" style={{ color: "#87867f" }}>
              {categoryIcon(check.category)}
              {check.category}
            </span>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "#5e5d59", lineHeight: 1.5 }}>
            {check.description}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 mt-0.5">
          {statusPill(check.status)}
          {open
            ? <ChevronDown  className="h-4 w-4" style={{ color: "#87867f" }} />
            : <ChevronRight className="h-4 w-4" style={{ color: "#87867f" }} />
          }
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-3" style={{ borderTop: "1px solid #f0eee6", backgroundColor: "#f5f4ed" }}>
          <p className="text-sm" style={{ color: "#4d4c48", lineHeight: 1.6 }}>
            <span className="font-medium" style={{ color: "#141413" }}>Finding: </span>
            {check.detail}
          </p>
          {check.recommendation && (
            <div className="mt-2.5 flex gap-2 items-start rounded-[6px] p-3"
              style={{ backgroundColor: "rgba(201,100,66,0.06)", border: "1px solid rgba(201,100,66,0.12)" }}>
              <Info className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "#c96442" }} />
              <p className="text-sm" style={{ color: "#4d4c48", lineHeight: 1.6 }}>
                <span className="font-medium" style={{ color: "#c96442" }}>Recommendation: </span>
                {check.recommendation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Main component ──────────────────────────────── */

export function CrawlResults({ report }: { report: CrawlReport }) {
  const categories = Array.from(new Set(report.checks.map((c) => c.category)))
  const passCnt = report.checks.filter((c) => c.status === "pass").length
  const failCnt = report.checks.filter((c) => c.status === "fail").length
  const warnCnt = report.checks.filter((c) => c.status === "warning").length
  const circumference = 2 * Math.PI * 38
  const strokeDash = (report.score / 100) * circumference

  return (
    <div className="space-y-5">

      {/* Score card */}
      <div
        className="rounded-[12px] p-6"
        style={{
          backgroundColor: "#faf9f5",
          border: "1px solid #f0eee6",
          boxShadow: "rgba(0,0,0,0.04) 0px 4px 24px",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          {/* Score ring */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg width="92" height="92" className="-rotate-90">
              <circle cx="46" cy="46" r="38" fill="none" stroke="#e8e6dc" strokeWidth="7" />
              <circle
                cx="46" cy="46" r="38" fill="none"
                stroke={scoreRingColor(report.score)}
                strokeWidth="7"
                strokeDasharray={`${strokeDash} ${circumference}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center leading-none">
              <span
                className="text-2xl leading-none"
                style={{
                  fontFamily: 'Georgia, serif',
                  fontWeight: 500,
                  ...gradeStyle(report.grade),
                }}
              >
                {report.grade}
              </span>
              <span className="text-xs mt-0.5" style={{ color: "#87867f" }}>
                {report.score}/100
              </span>
            </div>
          </div>

          {/* Summary */}
          <div className="flex-1">
            <p
              className="text-xs font-medium uppercase tracking-[0.5px] mb-1"
              style={{ color: "#87867f" }}
            >
              Results for
            </p>
            <h2
              className="mb-2 break-all leading-snug"
              style={{
                fontFamily: 'Georgia, serif',
                fontWeight: 500,
                fontSize: "1.15rem",
                color: "#141413",
              }}
            >
              {report.url}
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "#5e5d59", lineHeight: 1.6 }}>
              {report.summary}
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-4">
              <span className="flex items-center gap-1.5 text-xs" style={{ color: "#3a7c52" }}>
                <CheckCircle2 className="h-3.5 w-3.5" />
                {passCnt} passed
              </span>
              <span className="flex items-center gap-1.5 text-xs" style={{ color: "#b53333" }}>
                <XCircle className="h-3.5 w-3.5" />
                {failCnt} failed
              </span>
              <span className="flex items-center gap-1.5 text-xs" style={{ color: "#8a6a1a" }}>
                <AlertTriangle className="h-3.5 w-3.5" />
                {warnCnt} warnings
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex justify-between text-xs mb-2" style={{ color: "#87867f" }}>
            <span>AI Crawlability Score</span>
            <span style={{ color: "#141413", fontWeight: 500 }}>{report.score}%</span>
          </div>
          <Progress value={report.score} className="h-1.5" />
          <p className="text-xs mt-3" style={{ color: "#b0aea5" }}>
            Scanned {new Date(report.scannedAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Category sections */}
      {categories.map((cat) => {
        const catChecks = report.checks.filter((c) => c.category === cat)
        const catPass = catChecks.filter((c) => c.status === "pass").length
        return (
          <div
            key={cat}
            className="rounded-[8px] overflow-hidden"
            style={{
              backgroundColor: "#faf9f5",
              border: "1px solid #f0eee6",
              boxShadow: "rgba(0,0,0,0.04) 0px 4px 24px",
            }}
          >
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-2" style={{ color: "#141413" }}>
                {categoryIcon(cat)}
                <span
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontWeight: 500,
                    fontSize: "1rem",
                  }}
                >
                  {cat}
                </span>
              </div>
              <span className="text-xs" style={{ color: "#87867f" }}>
                {catPass}/{catChecks.length} passed
              </span>
            </div>
            <Separator />
            <div className="p-5 space-y-3">
              {catChecks.map((check) => (
                <CheckRow key={check.id} check={check} />
              ))}
            </div>
          </div>
        )
      })}

      {/* Dark "why it matters" card */}
      <div
        className="rounded-[12px] px-6 py-7"
        style={{ backgroundColor: "#141413" }}
      >
        <h3
          className="mb-3"
          style={{
            fontFamily: 'Georgia, serif',
            fontWeight: 500,
            fontSize: "1.1rem",
            color: "#faf9f5",
            lineHeight: 1.3,
          }}
        >
          What is AI Crawlability?
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "#b0aea5", lineHeight: 1.6 }}>
          AI crawlability measures how well a website can be discovered, indexed, and understood
          by AI systems like ChatGPT, Claude, Perplexity, and AI-powered browsers. As AI becomes
          a primary way people find information, ensuring your site is AI-friendly is critical
          for visibility and reach.
        </p>
      </div>

    </div>
  )
}
