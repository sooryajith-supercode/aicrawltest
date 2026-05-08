import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Changelog — AI Crawlability Test",
  description: "A running log of all updates, features, and fixes to the AI Crawlability Test tool.",
  alternates: { canonical: "/changelog" },
}

const CHANGES = [
  {
    version: "0.7.0",
    date: "2026-05-08",
    entries: [
      { type: "feat", text: 'Added "What\'s new in AEO" page with 3 curated industry updates from Yext, Position.digital, and PR News' },
      { type: "feat", text: "All external links on the new page carry UTM attribution (utm_source=aicrawltest)" },
      { type: "feat", text: 'Added "What\'s new in AEO" to the main nav across all pages' },
    ],
  },
  {
    version: "0.6.0",
    date: "2026-05-08",
    entries: [
      { type: "feat", text: 'New blog post: "Per-Page Markdown Files: The Easiest Win for AI Crawlability"' },
    ],
  },
  {
    version: "0.5.0",
    date: "2026-05-08",
    entries: [
      { type: "feat", text: "Supabase MCP server added to project config" },
      { type: "feat", text: "Supabase agent skills installed (Postgres Best Practices + Supabase)" },
      { type: "feat", text: "Scanned URLs are now saved to Supabase on every successful check" },
      { type: "fix", text: "Made the Supabase client lazy to prevent build-time crash when env vars are absent" },
      { type: "feat", text: "Added Supabase JS client integration (lib/supabase.ts)" },
    ],
  },
  {
    version: "0.4.0",
    date: "2026-05-08",
    entries: [
      { type: "feat", text: "Checked URLs are now logged to Vercel KV with a capped list (5,000 entries)" },
      { type: "feat", text: "Added GET /api/admin/urls endpoint protected by Authorization: Bearer header" },
    ],
  },
  {
    version: "0.3.0",
    date: "2026-05-08",
    entries: [
      { type: "feat", text: "Added blog section with 5 posts on AI crawlability, llms.txt, robots.txt, JSON-LD, and AEO" },
      { type: "feat", text: "Blog listing page at /blog with category tags, dates, and reading times" },
      { type: "feat", text: "Individual blog post pages with per-post Open Graph metadata and BlogPosting JSON-LD" },
      { type: "feat", text: "Author name (Soorya) shown on all blog posts" },
      { type: "feat", text: "Black star SVG favicon replacing default Vercel icon" },
      { type: "feat", text: "Added public/robots.txt with explicit Allow directives for all major AI crawlers" },
      { type: "feat", text: "Dynamic sitemap at /sitemap covering home, blog index, and all posts" },
      { type: "feat", text: "Upgraded layout.tsx with full Open Graph, Twitter Card, and JSON-LD structured data" },
      { type: "feat", text: "Added public/blog/*.md companion Markdown files for each post" },
      { type: "seo", text: "Aligned title, H1, and meta description with top search queries (crawlability checker, crawlability test)" },
      { type: "fix", text: "Removed event handlers from server components that caused Vercel build failures" },
    ],
  },
  {
    version: "0.2.0",
    date: "2026-05-07",
    entries: [
      { type: "feat", text: "Per-page markdown check: fetches homepage + one additional page, detects <link type=\"text/markdown\"> tag" },
      { type: "feat", text: "Live check-files API covering llms.txt, robots.txt, sitemap.xml, and per-page markdown" },
      { type: "feat", text: "Unified results UI with pass/fail cards for all four checks" },
      { type: "feat", text: "robots.txt directive breakdown showing User-agent: *, Disallow, Allow, and Sitemap entries" },
      { type: "feat", text: "Added llms.txt and public/index.md" },
      { type: "chore", text: "Bumped version to 0.2.0, displayed as semver in the header" },
      { type: "chore", text: "Rewrote README to describe the AI crawlability test tool" },
    ],
  },
  {
    version: "0.1.0",
    date: "2026-05-07",
    entries: [
      { type: "feat", text: "Initial AI crawlability test tool" },
      { type: "feat", text: "Live llms.txt check via server-side API" },
      { type: "feat", text: "Applied Anthropic-inspired design system from DESIGN.md" },
      { type: "feat", text: "Added Google Tag Manager (GTM-MMVT2P8D)" },
      { type: "feat", text: "Git short hash injected as version string in the header" },
    ],
  },
]

const TYPE_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  feat:  { label: "Feature", bg: "rgba(58,124,82,0.1)",   color: "#3a7c52" },
  fix:   { label: "Fix",     bg: "rgba(181,51,51,0.1)",   color: "#b53333" },
  seo:   { label: "SEO",     bg: "rgba(201,100,66,0.1)",  color: "#c96442" },
  chore: { label: "Chore",   bg: "rgba(135,134,127,0.15)", color: "#5e5d59" },
}

export default function ChangelogPage() {
  return (
    <div style={{ backgroundColor: "#f5f4ed", minHeight: "100vh" }}>
      {/* Nav */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ backgroundColor: "#f5f4ed", borderBottom: "1px solid #f0eee6" }}
      >
        <Link
          href="/"
          className="text-base font-medium tracking-tight"
          style={{ fontFamily: "Georgia, serif", color: "#141413", fontWeight: 500, textDecoration: "none" }}
        >
          AI Crawlability Test
        </Link>
        <div className="flex items-center gap-5">
          <Link href="/whats-new" className="text-sm font-medium hover-accent" style={{ color: "#5e5d59", textDecoration: "none" }}>
            What's new in AEO
          </Link>
          <Link href="/blog" className="text-sm font-medium hover-accent" style={{ color: "#5e5d59", textDecoration: "none" }}>
            Blog
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-2xl mx-auto px-6 pt-16 pb-10">
        <p className="text-xs font-medium uppercase mb-4" style={{ color: "#87867f", letterSpacing: "0.5px" }}>
          Product
        </p>
        <h1
          className="mb-4"
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontWeight: 500,
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            color: "#141413",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
          }}
        >
          Changelog
        </h1>
        <p className="text-base" style={{ color: "#5e5d59", lineHeight: 1.65 }}>
          Every update, feature, and fix to the AI Crawlability Test tool — newest first.
        </p>
      </section>

      {/* Entries */}
      <section className="max-w-2xl mx-auto px-6 pb-24">
        <div className="flex flex-col" style={{ borderTop: "1px solid #e8e5da" }}>
          {CHANGES.map((release) => (
            <div key={release.version} className="py-8" style={{ borderBottom: "1px solid #e8e5da" }}>
              <div className="flex items-baseline gap-3 mb-4">
                <span
                  className="font-medium"
                  style={{ fontFamily: "Georgia, serif", fontSize: "1.05rem", color: "#141413" }}
                >
                  v{release.version}
                </span>
                <span className="text-xs" style={{ color: "#87867f" }}>{release.date}</span>
              </div>
              <ul className="flex flex-col gap-2.5">
                {release.entries.map((entry, i) => {
                  const style = TYPE_STYLES[entry.type] ?? TYPE_STYLES.chore
                  return (
                    <li key={i} className="flex items-start gap-2.5">
                      <span
                        className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0 mt-0.5"
                        style={{ backgroundColor: style.bg, color: style.color }}
                      >
                        {style.label}
                      </span>
                      <span className="text-sm" style={{ color: "#5e5d59", lineHeight: 1.6 }}>
                        {entry.text}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 px-6" style={{ borderTop: "1px solid #f0eee6", backgroundColor: "#f5f4ed" }}>
        <p className="text-xs" style={{ color: "#87867f" }}>
          All checks are live — fetched directly from your site in real time.
        </p>
      </footer>
    </div>
  )
}
