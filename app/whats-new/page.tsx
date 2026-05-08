import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "What's New in AEO — Answer Engine Optimization Updates",
  description:
    "The latest research, data, and industry reports on answer engine optimization, AI search citations, and how AI systems like ChatGPT, Perplexity, and Gemini discover content.",
  alternates: { canonical: "/whats-new" },
  openGraph: {
    title: "What's New in AEO — Answer Engine Optimization Updates",
    description:
      "Latest research and industry reports on AI search citations, AEO, and content visibility in ChatGPT, Perplexity, and Gemini.",
    url: "https://aicrawltest.com/whats-new",
    type: "website",
  },
}

const UTM = "?utm_source=aicrawltest&utm_medium=referral"

const UPDATES = [
  {
    source: "Yext Research",
    date: "2025",
    title: "AI Visibility in 2025: How Gemini, ChatGPT, and Perplexity Cite Brands",
    summary:
      "Yext analysed 6.8 million citations across 1.6 million AI-generated responses and found citation behaviour varies dramatically by platform — Gemini favours brand-owned sites with structured data, ChatGPT leans on Wikipedia and directories, and Perplexity surfaces Reddit nearly half the time. Only 11% of cited domains appeared across multiple platforms.",
    url: `https://www.yext.com/blog/ai-visibility-in-2025-how-gemini-chatgpt-perplexity-cite-brands${UTM}`,
    tag: "Research",
  },
  {
    source: "Position.digital",
    date: "2026",
    title: "150+ AI SEO Statistics for 2026",
    summary:
      "A comprehensive data roundup: over 65% of searches now end without a click due to AI-generated answers, ChatGPT usage grew 156% in 12 months, and Perplexity grew 287%. Position 1 CTR drops 58% when an AI Overview is present. The GEO market is projected to grow from $848M in 2025 to $33.7B by 2034.",
    url: `https://www.position.digital/blog/ai-seo-statistics/${UTM}`,
    tag: "Data",
  },
  {
    source: "PR News",
    date: "2025",
    title: "94% of AI Citations Come from Earned Media. Brand Blogs Are Invisible.",
    summary:
      "A sobering finding for content marketers: AI systems overwhelmingly cite third-party earned media coverage rather than brand-owned blogs and product pages. The study challenges the assumption that publishing on your own site is enough — and points to a clear need for authoritative external mentions alongside on-site optimisation.",
    url: `https://everything-pr.com/94-of-ai-citations-come-from-earned-media-brand-blogs-are-invisible/${UTM}`,
    tag: "Insights",
  },
]

export default function WhatsNewPage() {
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
          <Link href="/whats-new" className="text-sm font-medium" style={{ color: "#c96442" }}>
            What's new in AEO
          </Link>
          <Link href="/blog" className="text-sm font-medium hover-accent" style={{ color: "#5e5d59", textDecoration: "none" }}>
            Blog
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-2xl mx-auto px-6 pt-16 pb-10">
        <p
          className="text-xs font-medium uppercase mb-4"
          style={{ color: "#87867f", letterSpacing: "0.5px" }}
        >
          Industry Updates
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
          What's new in AEO
        </h1>
        <p className="text-base" style={{ color: "#5e5d59", lineHeight: 1.65 }}>
          The latest research and data on answer engine optimisation — how AI systems cite content, what drives visibility in ChatGPT, Perplexity, and Gemini, and where the industry is heading.
        </p>
      </section>

      {/* Updates */}
      <section className="max-w-2xl mx-auto px-6 pb-20">
        <div className="flex flex-col" style={{ borderTop: "1px solid #e8e5da" }}>
          {UPDATES.map((item) => (
            <div
              key={item.url}
              className="py-8"
              style={{ borderBottom: "1px solid #e8e5da" }}
            >
              {/* Meta row */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: "rgba(201,100,66,0.1)", color: "#c96442" }}
                >
                  {item.tag}
                </span>
                <span className="text-xs" style={{ color: "#87867f" }}>{item.source}</span>
                <span className="text-xs" style={{ color: "#87867f" }}>· {item.date}</span>
              </div>

              {/* Title */}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <h2
                  className="font-medium mb-3 hover-accent"
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "1.1rem",
                    color: "#141413",
                    lineHeight: 1.35,
                    fontWeight: 500,
                  }}
                >
                  {item.title}
                </h2>
              </a>

              {/* Summary */}
              <p className="text-sm mb-4" style={{ color: "#5e5d59", lineHeight: 1.7 }}>
                {item.summary}
              </p>

              {/* Link */}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium hover-accent"
                style={{ color: "#c96442", textDecoration: "none" }}
              >
                Read on {item.source} →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-6" style={{ backgroundColor: "#141413" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="mb-4"
            style={{
              fontFamily: "Georgia, serif",
              fontWeight: 500,
              fontSize: "1.6rem",
              color: "#faf9f5",
              lineHeight: 1.2,
            }}
          >
            Check your site's AI crawlability
          </h2>
          <p className="mb-6 text-base" style={{ color: "#b0aea5", lineHeight: 1.6 }}>
            Free, instant, live checks — no account required.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-[6px] px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#c96442", color: "#fff" }}
          >
            Run free test →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="text-center py-8 px-6"
        style={{ borderTop: "1px solid #f0eee6", backgroundColor: "#f5f4ed" }}
      >
        <p className="text-xs" style={{ color: "#87867f" }}>
          All checks are live — fetched directly from your site in real time.
        </p>
      </footer>
    </div>
  )
}
