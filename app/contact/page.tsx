import type { Metadata } from "next"
import Link from "next/link"

const SITE_URL = "https://aicrawltest.com"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the AI Crawlability Test team. Questions, feedback, or partnership inquiries welcome.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — AI Crawlability Test",
    description: "Get in touch with the AI Crawlability Test team.",
    url: `${SITE_URL}/contact`,
    type: "website",
  },
}

export default function ContactPage() {
  return (
    <div style={{ backgroundColor: "#f5f4ed", minHeight: "100vh" }}>
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
        </nav>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-16 pb-24">
        <p className="text-xs font-medium uppercase mb-4" style={{ color: "#87867f", letterSpacing: "0.5px" }}>Contact</p>
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
          Get in touch
        </h1>

        <p className="text-lg mb-8" style={{ color: "#5e5d59", lineHeight: 1.65 }}>
          Questions, feedback, or ideas for new checks? We&apos;d love to hear from you.
        </p>

        <div
          className="rounded-[10px] p-6 mb-6"
          style={{ backgroundColor: "#faf9f5", border: "1px solid #f0eee6" }}
        >
          <h2
            className="mb-3"
            style={{ fontFamily: "Georgia, serif", fontWeight: 500, fontSize: "1.1rem", color: "#141413" }}
          >
            Email us
          </h2>
          <p className="text-sm mb-2" style={{ color: "#5e5d59", lineHeight: 1.6 }}>
            The fastest way to reach us is by email:
          </p>
          <a
            href="mailto:support@supercode.in"
            style={{ color: "#c96442", textDecoration: "none", fontSize: "1rem", fontWeight: 500 }}
          >
            support@supercode.in
          </a>
        </div>

        <div
          className="rounded-[10px] p-6"
          style={{ backgroundColor: "#faf9f5", border: "1px solid #f0eee6" }}
        >
          <h2
            className="mb-3"
            style={{ fontFamily: "Georgia, serif", fontWeight: 500, fontSize: "1.1rem", color: "#141413" }}
          >
            Common questions
          </h2>
          <p className="text-sm" style={{ color: "#5e5d59", lineHeight: 1.6 }}>
            Before reaching out, check the{" "}
            <Link href="/faq" style={{ color: "#c96442", textDecoration: "none" }}>FAQ</Link>
            {" "}— most common questions about how the tool works are answered there.
          </p>
        </div>
      </main>

      <footer className="py-8 px-6 text-center" style={{ borderTop: "1px solid #f0eee6" }}>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-3">
          <Link href="/" className="text-xs hover-accent" style={{ color: "#87867f", textDecoration: "none" }}>Home</Link>
          <Link href="/blog" className="text-xs hover-accent" style={{ color: "#87867f", textDecoration: "none" }}>Blog</Link>
          <Link href="/faq" className="text-xs hover-accent" style={{ color: "#87867f", textDecoration: "none" }}>FAQ</Link>
          <Link href="/about" className="text-xs hover-accent" style={{ color: "#87867f", textDecoration: "none" }}>About</Link>
          <Link href="/privacy" className="text-xs hover-accent" style={{ color: "#87867f", textDecoration: "none" }}>Privacy</Link>
        </nav>
        <p className="text-xs" style={{ color: "#b0aea5" }}>
          © {new Date().getFullYear()} AI Crawlability Test
        </p>
      </footer>
    </div>
  )
}
