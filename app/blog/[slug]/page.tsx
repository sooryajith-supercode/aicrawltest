import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { BLOG_POSTS, getBlogPost, getRelatedPosts, type ContentSection } from "@/lib/blog"

const SITE_URL = "https://aicrawltest.com"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author, url: SITE_URL }],
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
      siteName: "AI Crawlability Test",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function renderSection(section: ContentSection, index: number) {
  const key = index

  switch (section.type) {
    case "h2":
      return (
        <h2
          key={key}
          style={{
            fontFamily: "Georgia, serif",
            fontWeight: 500,
            fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)",
            color: "#141413",
            lineHeight: 1.25,
            marginTop: "2.5rem",
            marginBottom: "0.75rem",
          }}
        >
          {section.content}
        </h2>
      )

    case "h3":
      return (
        <h3
          key={key}
          style={{
            fontFamily: "Georgia, serif",
            fontWeight: 500,
            fontSize: "1.1rem",
            color: "#141413",
            lineHeight: 1.3,
            marginTop: "2rem",
            marginBottom: "0.5rem",
          }}
        >
          {section.content}
        </h3>
      )

    case "p":
      return (
        <p
          key={key}
          style={{ color: "#3d3c38", lineHeight: 1.75, marginBottom: "1rem", fontSize: "1.0625rem" }}
          dangerouslySetInnerHTML={{ __html: section.content ?? "" }}
        />
      )

    case "ul":
      return (
        <ul key={key} style={{ marginBottom: "1rem", paddingLeft: "1.5rem" }}>
          {(section.items ?? []).map((item, i) => (
            <li
              key={i}
              style={{ color: "#3d3c38", lineHeight: 1.75, marginBottom: "0.4rem", fontSize: "1.0625rem" }}
              dangerouslySetInnerHTML={{ __html: item }}
            />
          ))}
        </ul>
      )

    case "ol":
      return (
        <ol key={key} style={{ marginBottom: "1rem", paddingLeft: "1.5rem" }}>
          {(section.items ?? []).map((item, i) => (
            <li
              key={i}
              style={{ color: "#3d3c38", lineHeight: 1.75, marginBottom: "0.4rem", fontSize: "1.0625rem" }}
              dangerouslySetInnerHTML={{ __html: item }}
            />
          ))}
        </ol>
      )

    case "code":
      return (
        <pre
          key={key}
          className="overflow-x-auto rounded-[8px] p-4 text-sm"
          style={{
            backgroundColor: "#1e1d1b",
            color: "#e8e5da",
            fontFamily: "var(--font-geist-mono), monospace",
            lineHeight: 1.6,
            marginBottom: "1.25rem",
            marginTop: "0.5rem",
          }}
        >
          <code>{section.content}</code>
        </pre>
      )

    case "callout":
      return (
        <div
          key={key}
          className="rounded-[8px] p-5"
          style={{
            backgroundColor: "rgba(201,100,66,0.08)",
            border: "1px solid rgba(201,100,66,0.2)",
            marginBottom: "1.25rem",
            marginTop: "1.25rem",
          }}
        >
          <p
            style={{ color: "#5e3020", lineHeight: 1.7, fontSize: "1.0625rem", margin: 0 }}
            dangerouslySetInnerHTML={{ __html: section.content ?? "" }}
          />
        </div>
      )

    default:
      return null
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const related = getRelatedPosts(slug, 3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.author,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "AI Crawlability Test",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    keywords: post.tags.join(", "),
    articleSection: post.category,
    timeRequired: `PT${post.readingTimeMinutes}M`,
    url: `${SITE_URL}/blog/${post.slug}`,
  }

  return (
    <div style={{ backgroundColor: "#f5f4ed", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
        <Link
          href="/blog"
          className="text-sm font-medium"
          style={{ color: "#c96442" }}
        >
          ← Blog
        </Link>
      </header>

      {/* Article */}
      <article className="max-w-2xl mx-auto px-6 pt-14 pb-20">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <span
            className="text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "rgba(201,100,66,0.1)", color: "#c96442" }}
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

        {/* Title */}
        <h1
          className="mb-5"
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontWeight: 500,
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            color: "#141413",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
          }}
        >
          {post.title}
        </h1>

        {/* Description */}
        <p
          className="text-lg mb-8 pb-8"
          style={{
            color: "#5e5d59",
            lineHeight: 1.65,
            borderBottom: "1px solid #e8e5da",
          }}
        >
          {post.description}
        </p>

        {/* Content */}
        <div>{post.sections.map((section, i) => renderSection(section, i))}</div>

        {/* Tags */}
        <div
          className="flex flex-wrap gap-2 mt-12 pt-8"
          style={{ borderTop: "1px solid #e8e5da" }}
        >
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded"
              style={{ backgroundColor: "#f0eee6", color: "#5e5d59" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section
          className="max-w-2xl mx-auto px-6 pb-20"
          style={{ borderTop: "1px solid #e8e5da" }}
        >
          <h2
            className="mt-12 mb-6"
            style={{
              fontFamily: "Georgia, serif",
              fontWeight: 500,
              fontSize: "1.2rem",
              color: "#141413",
            }}
          >
            More articles
          </h2>
          <div className="flex flex-col gap-6">
            {related.map((rel) => (
              <div key={rel.slug}>
                <span className="text-xs" style={{ color: "#87867f" }}>
                  {formatDate(rel.publishedAt)} · {rel.readingTimeMinutes} min
                </span>
                <Link
                  href={`/blog/${rel.slug}`}
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <p
                    className="mt-1 text-base font-medium hover-accent"
                    style={{ fontFamily: "Georgia, serif", color: "#141413" }}
                  >
                    {rel.title}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

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
