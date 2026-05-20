import type { Metadata } from "next"
import Link from "next/link"

const SITE_URL = "https://aicrawltest.com"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for AI Crawlability Test. Learn what data we collect, how we use it, and your rights.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy — AI Crawlability Test",
    description: "Privacy policy for AI Crawlability Test.",
    url: `${SITE_URL}/privacy`,
    type: "website",
  },
}

export default function PrivacyPage() {
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
          <Link href="/contact" className="text-sm font-medium hover-accent" style={{ color: "#5e5d59", textDecoration: "none" }}>Contact</Link>
        </nav>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-16 pb-24">
        <p className="text-xs font-medium uppercase mb-4" style={{ color: "#87867f", letterSpacing: "0.5px" }}>Legal</p>
        <h1
          className="mb-3"
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontWeight: 500,
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            color: "#141413",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
          }}
        >
          Privacy Policy
        </h1>
        <p className="mb-10" style={{ color: "#87867f", fontSize: "0.875rem" }}>Last updated: May 2025</p>

        {[
          {
            title: "What we collect",
            body: "When you run a crawl test, we store the URL you submitted and the timestamp of the request. If you choose to unlock the full report, we also collect the name and email address you provide. We do not collect any personal data beyond what you explicitly provide.",
          },
          {
            title: "How we use it",
            body: "Submitted URLs are used to improve the tool and understand which types of sites people check. Email addresses are used only to share relevant updates about AI crawlability — you can unsubscribe at any time. We do not sell, rent, or share your data with third parties.",
          },
          {
            title: "Analytics",
            body: "We use Google Tag Manager to collect anonymous usage analytics — page views, feature interactions, and error rates. No personally identifiable information is included in these events. You can opt out via your browser's privacy settings.",
          },
          {
            title: "Data storage",
            body: "Submitted URL logs are stored in Supabase (cloud database). Email addresses collected via the lead gate are stored in Supabase as well. Data is retained for up to 12 months and then deleted.",
          },
          {
            title: "Your rights",
            body: "You can request deletion of any data associated with your email address by contacting us at support@supercode.in. We will process requests within 30 days.",
          },
          {
            title: "Changes",
            body: "We may update this policy from time to time. Continued use of the service after changes constitutes acceptance of the updated policy.",
          },
          {
            title: "Contact",
            body: "Questions about this policy? Email support@supercode.in.",
          },
        ].map(({ title, body }) => (
          <div key={title} style={{ borderTop: "1px solid #e8e5da", paddingTop: "1.5rem", marginTop: "1.5rem" }}>
            <h2
              className="mb-3"
              style={{ fontFamily: "Georgia, serif", fontWeight: 500, fontSize: "1.15rem", color: "#141413" }}
            >
              {title}
            </h2>
            <p style={{ color: "#3d3c38", lineHeight: 1.75 }}>{body}</p>
          </div>
        ))}
      </main>

      <footer className="py-8 px-6 text-center" style={{ borderTop: "1px solid #f0eee6" }}>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-3">
          <Link href="/" className="text-xs hover-accent" style={{ color: "#87867f", textDecoration: "none" }}>Home</Link>
          <Link href="/blog" className="text-xs hover-accent" style={{ color: "#87867f", textDecoration: "none" }}>Blog</Link>
          <Link href="/about" className="text-xs hover-accent" style={{ color: "#87867f", textDecoration: "none" }}>About</Link>
          <Link href="/contact" className="text-xs hover-accent" style={{ color: "#87867f", textDecoration: "none" }}>Contact</Link>
        </nav>
        <p className="text-xs" style={{ color: "#b0aea5" }}>
          © {new Date().getFullYear()} AI Crawlability Test
        </p>
      </footer>
    </div>
  )
}
