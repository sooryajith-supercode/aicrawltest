import type { Metadata } from "next"
import Link from "next/link"

const SITE_URL = "https://aicrawltest.com"

export const metadata: Metadata = {
  title: "About",
  description:
    "AI Crawlability Test is a free tool that checks whether your website is ready for AI agents, crawlers, and AI-powered search engines.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — AI Crawlability Test",
    description: "Free tool to check if your website is ready for AI agents, crawlers, and AI-powered search engines.",
    url: `${SITE_URL}/about`,
    type: "website",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About AI Crawlability Test",
  url: `${SITE_URL}/about`,
  description: "AI Crawlability Test is a free tool to check whether your website is structured for AI agents, crawlers, and AI-powered search engines.",
  author: {
    "@type": "Person",
    "@id": `${SITE_URL}/#author`,
    name: "Soorya",
    url: `${SITE_URL}/about`,
  },
}

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: "#f5f4ed", minHeight: "100vh" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

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
        <nav className="flex items-center gap-5">
          <Link href="/blog" className="text-sm font-medium hover-accent" style={{ color: "#5e5d59", textDecoration: "none" }}>Blog</Link>
          <Link href="/faq" className="text-sm font-medium hover-accent" style={{ color: "#5e5d59", textDecoration: "none" }}>FAQ</Link>
          <Link href="/contact" className="text-sm font-medium hover-accent" style={{ color: "#5e5d59", textDecoration: "none" }}>Contact</Link>
        </nav>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-16 pb-24">
        <p className="text-xs font-medium uppercase mb-4" style={{ color: "#87867f", letterSpacing: "0.5px" }}>About</p>
        <h1
          className="mb-6"
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontWeight: 500,
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            color: "#141413",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
          }}
        >
          About AI Crawlability Test
        </h1>

        <p className="text-lg mb-6" style={{ color: "#5e5d59", lineHeight: 1.65 }}>
          AI Crawlability Test is a free tool that checks whether your website is structured for AI agents,
          crawlers, and AI-powered search engines like ChatGPT, Claude, and Perplexity.
        </p>

        <div style={{ borderTop: "1px solid #e8e5da", paddingTop: "2rem", marginTop: "2rem" }}>
          <h2
            className="mb-4"
            style={{ fontFamily: "Georgia, serif", fontWeight: 500, fontSize: "1.25rem", color: "#141413" }}
          >
            What it does
          </h2>
          <p className="mb-4" style={{ color: "#3d3c38", lineHeight: 1.75 }}>
            Enter any URL and get an instant audit across 20+ checks — from llms.txt and robots.txt
            directives to structured data, Open Graph tags, semantic HTML, internal linking, authority
            signals, and more. Every check runs live against your site; nothing is cached.
          </p>
          <p style={{ color: "#3d3c38", lineHeight: 1.75 }}>
            The audit is graded A–F and each failing check includes a specific recommendation so you
            know exactly what to fix.
          </p>
        </div>

        <div style={{ borderTop: "1px solid #e8e5da", paddingTop: "2rem", marginTop: "2rem" }}>
          <h2
            className="mb-4"
            style={{ fontFamily: "Georgia, serif", fontWeight: 500, fontSize: "1.25rem", color: "#141413" }}
          >
            Why AI crawlability matters
          </h2>
          <p className="mb-4" style={{ color: "#3d3c38", lineHeight: 1.75 }}>
            ChatGPT, Claude, Perplexity, and AI-powered browsers are rapidly replacing traditional search
            as the way people find information. If your site isn't structured for AI crawlers, you risk
            becoming invisible — even if you rank well on Google today.
          </p>
          <p style={{ color: "#3d3c38", lineHeight: 1.75 }}>
            AI systems use llms.txt, structured data, clean HTML, and authority signals to decide which
            sites to index and cite. This tool helps you close those gaps.
          </p>
        </div>

        <div style={{ borderTop: "1px solid #e8e5da", paddingTop: "2rem", marginTop: "2rem" }}>
          <h2
            className="mb-4"
            style={{ fontFamily: "Georgia, serif", fontWeight: 500, fontSize: "1.25rem", color: "#141413" }}
          >
            Built by
          </h2>
          <p style={{ color: "#3d3c38", lineHeight: 1.75 }}>
            Built by <strong>Soorya</strong> at{" "}
            <a
              href="https://supercode.in"
              style={{ color: "#c96442", textDecoration: "none" }}
            >
              Supercode
            </a>
            . Questions or feedback?{" "}
            <Link href="/contact" style={{ color: "#c96442", textDecoration: "none" }}>
              Get in touch.
            </Link>
          </p>
        </div>

        <div style={{ marginTop: "2.5rem" }}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-[6px] px-5 py-2.5 text-sm font-medium"
            style={{ backgroundColor: "#141413", color: "#faf9f5", textDecoration: "none" }}
          >
            Run a free crawl test →
          </Link>
        </div>
      </main>

      <footer className="py-8 px-6 text-center" style={{ borderTop: "1px solid #f0eee6" }}>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-3">
          <Link href="/" className="text-xs hover-accent" style={{ color: "#87867f", textDecoration: "none" }}>Home</Link>
          <Link href="/blog" className="text-xs hover-accent" style={{ color: "#87867f", textDecoration: "none" }}>Blog</Link>
          <Link href="/faq" className="text-xs hover-accent" style={{ color: "#87867f", textDecoration: "none" }}>FAQ</Link>
          <Link href="/contact" className="text-xs hover-accent" style={{ color: "#87867f", textDecoration: "none" }}>Contact</Link>
          <Link href="/privacy" className="text-xs hover-accent" style={{ color: "#87867f", textDecoration: "none" }}>Privacy</Link>
        </nav>
        <p className="text-xs" style={{ color: "#b0aea5" }}>
          © {new Date().getFullYear()} AI Crawlability Test
        </p>
      </footer>
    </div>
  )
}
