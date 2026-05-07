import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import "./globals.css"

const SITE_URL = "https://aicrawltest.com"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AI Crawlability Test — Is Your Site Ready for AI Search?",
    template: "%s | AI Crawlability Test",
  },
  description:
    "Free tool to check if your website is visible to AI agents, crawlers, and AI-powered search engines like ChatGPT, Claude, and Perplexity. Test llms.txt, robots.txt, sitemap.xml, and more.",
  keywords: [
    "AI crawlability",
    "llms.txt",
    "AI SEO",
    "AI search optimization",
    "robots.txt",
    "sitemap.xml",
    "AI agents",
    "AI indexing",
    "answer engine optimization",
    "AEO",
    "GPTBot",
    "ClaudeBot",
    "website AI readiness",
  ],
  authors: [{ name: "AI Crawlability Test", url: SITE_URL }],
  creator: "AI Crawlability Test",
  publisher: "AI Crawlability Test",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "AI Crawlability Test",
    title: "AI Crawlability Test — Is Your Site Ready for AI Search?",
    description:
      "Free tool to check if your website is visible to AI agents, crawlers, and AI-powered search engines. Test llms.txt, robots.txt, sitemap.xml, and more.",
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Crawlability Test — Is Your Site Ready for AI Search?",
    description:
      "Free tool to check if your website is visible to AI agents and AI-powered search engines. Test llms.txt, robots.txt, sitemap.xml instantly.",
    creator: "@aicrawltest",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "AI Crawlability Test",
      description:
        "Free tool to check if your website is ready for AI agents, crawlers, and AI-powered search engines.",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/?url={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#app`,
      name: "AI Crawlability Test",
      url: SITE_URL,
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "Check whether your website has llms.txt, robots.txt, sitemap.xml, structured data, and other signals AI crawlers and agents need to index your content.",
      featureList: [
        "llms.txt validation",
        "robots.txt AI directive checks",
        "sitemap.xml discovery",
        "Per-page markdown file detection",
        "Live real-time checks",
      ],
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "AI Crawlability Test",
      url: SITE_URL,
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script id="gtm" strategy="beforeInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MMVT2P8D');`}</Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MMVT2P8D"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  )
}
