import type { Metadata } from "next"
import Link from "next/link"
import { BLOG_POSTS } from "@/lib/blog"

export const metadata: Metadata = {
  title: "Blog — Crawlability Checker, Crawl Test & AI SEO Guides",
  description:
    "In-depth guides on crawlability checkers, crawl testing, AI crawlability, llms.txt, robots.txt for AI crawlers, structured data, and optimizing your website for AI-powered search engines.",
  keywords: [
    "crawlability checker guide",
    "crawl test tutorial",
    "website crawlability",
    "crawling test",
    "AI crawlability",
    "llms.txt guide",
    "robots.txt AI crawlers",
    "check crawlability",
    "test website crawlability",
    "crawlability audit",
    "AI SEO",
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog — Crawlability Checker, Crawl Test & AI SEO Guides",
    description:
      "In-depth guides on crawlability testing, AI crawlability, llms.txt, robots.txt, structured data, and AI search engine optimization.",
    url: "https://aicrawltest.com/blog",
    type: "website",
  },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function BlogIndexPage() {
  const sorted = [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

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
          <Link
            href="/whats-new"
            className="text-sm font-medium hover-accent"
            style={{ color: "#5e5d59", textDecoration: "none" }}
          >
            What's new in AEO
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium"
            style={{ color: "#c96442" }}
          >
            Blog
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-10">
        <p
          className="text-xs font-medium uppercase mb-4"
          style={{ color: "#87867f", letterSpacing: "0.5px" }}
        >
          Resources
        </p>
        <h1
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontWeight: 500,
            fontSize: "clamp(2rem, 4vw, 2.75rem)",
            color: "#141413",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
          }}
        >
          AI Crawlability Blog
        </h1>
        <p
          className="mt-4 text-lg"
          style={{ color: "#5e5d59", lineHeight: 1.6, maxWidth: "38rem" }}
        >
          Guides on making your website visible to AI agents, crawlers, and
          AI-powered search engines.
        </p>
      </section>

      {/* Post list */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div
          style={{ borderTop: "1px solid #e8e5da" }}
          className="flex flex-col"
        >
          {sorted.map((post) => (
            <article
              key={post.slug}
              className="py-8"
              style={{ borderBottom: "1px solid #e8e5da" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: "rgba(201,100,66,0.1)",
                    color: "#c96442",
                  }}
                >
                  {post.category}
                </span>
                <span className="text-sm" style={{ color: "#87867f" }}>
                  {formatDate(post.publishedAt)}
                </span>
                <span className="text-sm" style={{ color: "#87867f" }}>
                  · {post.readingTimeMinutes} min read
                </span>
              </div>

              <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                <h2
                  className="mb-2 hover-accent"
                  style={{
                    fontFamily: "Georgia, serif",
                    fontWeight: 500,
                    fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)",
                    color: "#141413",
                    lineHeight: 1.3,
                  }}
                >
                  {post.title}
                </h2>
              </Link>

              <p className="text-base mb-4" style={{ color: "#5e5d59", lineHeight: 1.6 }}>
                {post.description}
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                {post.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ backgroundColor: "#f0eee6", color: "#87867f" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6" style={{ backgroundColor: "#141413" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="mb-4"
            style={{
              fontFamily: "Georgia, serif",
              fontWeight: 500,
              fontSize: "1.75rem",
              color: "#faf9f5",
              lineHeight: 1.2,
            }}
          >
            Check your site now
          </h2>
          <p className="mb-6 text-base" style={{ color: "#b0aea5", lineHeight: 1.6 }}>
            See how your site scores on AI crawlability — instantly, for free.
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
