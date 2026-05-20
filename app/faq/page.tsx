import type { Metadata } from "next"
import Link from "next/link"

const SITE_URL = "https://aicrawltest.com"

export const metadata: Metadata = {
  title: "FAQ — AI Crawlability Questions Answered",
  description:
    "Frequently asked questions about AI crawlability, llms.txt, robots.txt for AI bots, structured data, and how to optimise your site for AI search engines.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ — AI Crawlability Test",
    description: "Answers to the most common questions about AI crawlability, llms.txt, and optimising for AI search.",
    url: `${SITE_URL}/faq`,
    type: "website",
  },
}

const FAQS = [
  {
    q: "What is AI crawlability?",
    a: "AI crawlability is how well AI systems — like ChatGPT, Claude, and Perplexity — can discover, access, and understand your website's content. A crawlable site has the right files (llms.txt, robots.txt, sitemap.xml), structured data, clean HTML, and public pages AI agents can index.",
  },
  {
    q: "What is llms.txt?",
    a: "llms.txt is a Markdown file placed at /llms.txt on your site. It gives AI agents a structured overview of your site: what it does, what pages exist, and where key content lives. Think of it as a table of contents written for AI. The spec is documented at llmstxt.org.",
  },
  {
    q: "How is AI crawlability different from regular SEO?",
    a: "Traditional SEO focuses on signals like backlinks, keyword density, and page speed for Google and Bing. AI crawlability focuses on machine-readable structure — llms.txt, JSON-LD schema, semantic HTML, clean text, and explicit crawl permissions for AI bots — so AI systems can understand and cite your content accurately.",
  },
  {
    q: "Which AI crawlers should I allow in robots.txt?",
    a: "The most important ones are GPTBot (OpenAI), ClaudeBot and anthropic-ai (Anthropic), ChatGPT-User, and PerplexityBot. Add explicit User-agent sections with Allow: / for each. Never block them unless you have a legal reason to.",
  },
  {
    q: "What is structured data and why does it matter for AI?",
    a: "Structured data is JSON-LD markup embedded in your pages that describes what your content is — Article, Product, FAQPage, Organization, etc. AI systems use it to understand page context without reading every word, which makes your content more likely to appear in AI-generated answers.",
  },
  {
    q: "How does the crawl test work?",
    a: "When you enter a URL, our tool fetches your site in real time using our own crawler bot and runs 20+ checks. Every result is live — nothing is cached. We check for llms.txt, robots.txt directives, sitemap.xml, structured data, Open Graph tags, HTML structure, internal linking, authority signals, and more.",
  },
  {
    q: "What score should I aim for?",
    a: "A grade of A (90+) means your site follows most best practices. A B (75+) is good but has room to improve. Anything below C (60) means there are significant gaps that could be hurting your visibility in AI-powered search results.",
  },
  {
    q: "Is the tool free?",
    a: "Yes, the full audit is free. You can see the score summary and first few checks immediately. Unlock all checks and recommendations by entering your email — still free, no payment required.",
  },
  {
    q: "How often should I re-check my site?",
    a: "Re-run the audit whenever you make significant changes to your site structure, metadata, or content strategy. We also recommend checking quarterly as AI crawler requirements evolve.",
  },
  {
    q: "What is an MCP server card?",
    a: "An MCP (Model Context Protocol) server card is a JSON file at /.well-known/mcp.json that describes what tools or capabilities your site exposes to AI agents. It lets agents discover and use your site's functionality automatically, similar to how OpenAPI specs describe REST APIs.",
  },
]

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  name: "AI Crawlability FAQ",
  url: `${SITE_URL}/faq`,
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: {
      "@type": "Answer",
      text: a,
    },
  })),
}

export default function FaqPage() {
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
          <Link href="/about" className="text-sm font-medium hover-accent" style={{ color: "#5e5d59", textDecoration: "none" }}>About</Link>
          <Link href="/contact" className="text-sm font-medium hover-accent" style={{ color: "#5e5d59", textDecoration: "none" }}>Contact</Link>
        </nav>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-16 pb-24">
        <p className="text-xs font-medium uppercase mb-4" style={{ color: "#87867f", letterSpacing: "0.5px" }}>Help</p>
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
          Frequently asked questions
        </h1>
        <p className="mb-12 text-lg" style={{ color: "#5e5d59", lineHeight: 1.6 }}>
          Everything you need to know about AI crawlability and how the tool works.
        </p>

        <div className="flex flex-col">
          {FAQS.map(({ q, a }, i) => (
            <div
              key={i}
              className="py-6"
              style={{ borderTop: "1px solid #e8e5da" }}
            >
              <h2
                className="mb-3"
                style={{
                  fontFamily: "Georgia, serif",
                  fontWeight: 500,
                  fontSize: "1.1rem",
                  color: "#141413",
                  lineHeight: 1.3,
                }}
              >
                {q}
              </h2>
              <p style={{ color: "#3d3c38", lineHeight: 1.75 }}>{a}</p>
            </div>
          ))}
        </div>

        <div
          className="mt-12 rounded-[10px] p-6 text-center"
          style={{ backgroundColor: "#faf9f5", border: "1px solid #f0eee6" }}
        >
          <p className="mb-3" style={{ color: "#5e5d59", lineHeight: 1.6 }}>
            Still have questions? Read our in-depth{" "}
            <Link href="/blog" style={{ color: "#c96442", textDecoration: "none" }}>blog guides</Link>{" "}
            or <Link href="/contact" style={{ color: "#c96442", textDecoration: "none" }}>contact us</Link>.
          </p>
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
          <Link href="/about" className="text-xs hover-accent" style={{ color: "#87867f", textDecoration: "none" }}>About</Link>
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
