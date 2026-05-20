import { NextResponse } from "next/server"
import { BLOG_POSTS } from "@/lib/blog"

const SITE_URL = "https://aicrawltest.com"

export async function GET() {
  const sorted = [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  const items = sorted.map((post) => {
    const url = `${SITE_URL}/blog/${post.slug}`
    const pubDate = new Date(post.publishedAt).toUTCString()
    return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <author>support@supercode.in (${post.author})</author>
      <category>${post.category}</category>
    </item>`
  })

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AI Crawlability Test Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Guides on making your website visible to AI agents, crawlers, and AI-powered search engines.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/api/feed" rel="self" type="application/rss+xml" />
    <managingEditor>support@supercode.in (Soorya)</managingEditor>
    <webMaster>support@supercode.in (Soorya)</webMaster>
    <copyright>© ${new Date().getFullYear()} AI Crawlability Test</copyright>
    ${items.join("")}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  })
}
