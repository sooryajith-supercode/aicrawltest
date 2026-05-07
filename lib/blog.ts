export interface ContentSection {
  type: "h2" | "h3" | "p" | "ul" | "ol" | "callout" | "code"
  content?: string
  items?: string[]
  language?: string
}

export interface BlogPost {
  slug: string
  title: string
  description: string
  publishedAt: string
  author: string
  category: string
  tags: string[]
  readingTimeMinutes: number
  sections: ContentSection[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "what-is-llms-txt",
    title: "What is llms.txt and Why Every Website Needs One",
    description:
      "Learn about the llms.txt specification — the emerging standard that helps AI agents and large language models understand and navigate your website's content.",
    publishedAt: "2025-04-01",
    author: "AI Crawlability Test",
    category: "Guides",
    tags: ["llms.txt", "AI crawlability", "LLM", "AI agents", "site manifest"],
    readingTimeMinutes: 7,
    sections: [
      {
        type: "p",
        content:
          "In the age of AI-powered search, a new file is rapidly becoming as essential as robots.txt: <code>llms.txt</code>. While robots.txt tells crawlers what they can access, llms.txt tells large language models (LLMs) <em>how</em> to understand and work with your site. If you've never heard of it, now is the time to pay attention.",
      },
      {
        type: "h2",
        content: "What Is llms.txt?",
      },
      {
        type: "p",
        content:
          "llms.txt is a plain-text Markdown file placed at the root of your website (<code>/llms.txt</code>). It provides AI agents with a structured, human-readable overview of your site: what it does, what content it contains, and where to find key pages. Think of it as a table of contents written specifically for artificial intelligence.",
      },
      {
        type: "p",
        content:
          "The specification was introduced by fast.ai and documented at llmstxt.org. It defines a minimal format: a title, an optional description, and a list of sections containing links with short descriptions. This simple structure allows LLMs to quickly orient themselves within your site's content — even before crawling individual pages.",
      },
      {
        type: "h2",
        content: "The llms.txt Format",
      },
      {
        type: "p",
        content: "A valid llms.txt file looks like this:",
      },
      {
        type: "code",
        language: "markdown",
        content: `# My Company

> We build developer tools for the AI era.

## Documentation

- [Getting Started](/docs/start.md): How to set up and run your first project.
- [API Reference](/docs/api.md): Complete reference for all API endpoints.

## Blog

- [What is llms.txt](/blog/what-is-llms-txt.md): Introduction to the llms.txt standard.`,
      },
      {
        type: "p",
        content:
          "The <code>#</code> heading is the site name. The <code>&gt;</code> blockquote is a one-line description. Sections (<code>##</code>) group related links, and each link entry includes a short description after the colon.",
      },
      {
        type: "h2",
        content: "Why AI Agents Need llms.txt",
      },
      {
        type: "p",
        content:
          "When a large language model like Claude or ChatGPT visits a website, it often needs to answer a specific question quickly. Without guidance, it must crawl multiple pages, parse HTML, ignore navigation and ads, and piece together a mental model of your site — all within a limited context window.",
      },
      {
        type: "p",
        content:
          "llms.txt eliminates this friction. By providing a curated map of your most important content, you help AI agents find the right information faster, produce more accurate answers about your products or services, and represent your brand correctly to users who ask about you.",
      },
      {
        type: "ul",
        items: [
          "AI agents can answer questions about your site accurately without guessing",
          "Reduces the chance of LLMs hallucinating incorrect information about your brand",
          "Helps AI-powered search surfaces (Perplexity, ChatGPT, Claude) cite your content",
          "Works alongside per-page <code>.md</code> files for granular content access",
          "Future-proofs your site as AI browsing becomes mainstream",
        ],
      },
      {
        type: "h2",
        content: "llms.txt vs. Other Crawl Files",
      },
      {
        type: "p",
        content:
          "You might wonder how llms.txt fits alongside the files you already have. Here's the distinction:",
      },
      {
        type: "ul",
        items: [
          "<strong>robots.txt</strong> — Controls <em>access</em>: which bots can visit which paths",
          "<strong>sitemap.xml</strong> — Controls <em>discovery</em>: lists all URLs so crawlers know what exists",
          "<strong>llms.txt</strong> — Controls <em>comprehension</em>: explains what your site is about and where key content lives",
        ],
      },
      {
        type: "p",
        content:
          "All three serve different purposes and all three should coexist. A well-prepared site has all of them.",
      },
      {
        type: "h2",
        content: "Per-Page Markdown Companions",
      },
      {
        type: "p",
        content:
          "llms.txt often links to Markdown versions of your pages (e.g., <code>/about.md</code> alongside <code>/about</code>). These per-page Markdown files give AI agents clean, distraction-free content — no navigation, no ads, no JavaScript. Pure text.",
      },
      {
        type: "p",
        content:
          "If your site has a blog post at <code>/blog/how-to-start</code>, adding a companion at <code>/blog/how-to-start.md</code> means AI agents can read the content directly, without executing JavaScript or stripping HTML boilerplate. This dramatically improves the quality of AI-generated answers that cite your work.",
      },
      {
        type: "h2",
        content: "How to Create Your llms.txt Today",
      },
      {
        type: "ol",
        items: [
          "Open a text editor and create a file named <code>llms.txt</code>",
          "Add a <code>#</code> heading with your site or brand name",
          "Add a <code>&gt;</code> blockquote with a one-sentence description of your site",
          "Create <code>##</code> sections for major content areas (Docs, Blog, Products, etc.)",
          "List your most important pages as Markdown links with descriptions",
          "Place the file at the root of your site (accessible at <code>yoursite.com/llms.txt</code>)",
          "Optionally add <code>/.well-known/llms.txt</code> as a mirror",
        ],
      },
      {
        type: "callout",
        content:
          "Test your llms.txt right now: enter your URL in the <a href='/'>AI Crawlability Test</a> tool above to see if your file is detected and properly formatted.",
      },
      {
        type: "h2",
        content: "The Bigger Picture",
      },
      {
        type: "p",
        content:
          "llms.txt is one piece of a larger AI visibility puzzle. Combined with a proper robots.txt that explicitly allows AI crawlers, a sitemap.xml for page discovery, structured data (JSON-LD) for machine-readable context, and Open Graph tags for rich previews, it forms a comprehensive foundation for AI-era web presence.",
      },
      {
        type: "p",
        content:
          "Early adopters who implement llms.txt today are positioning their sites to be cited, referenced, and recommended by AI systems as those systems become the primary interface between people and information on the web.",
      },
    ],
  },
  {
    slug: "optimize-for-ai-search",
    title: "How to Optimize Your Website for AI Search Engines",
    description:
      "AI-powered search engines like Perplexity, ChatGPT Browse, and Claude work very differently from Google. Here's how to optimize your site for the new paradigm of answer engine optimization.",
    publishedAt: "2025-04-08",
    author: "AI Crawlability Test",
    category: "SEO",
    tags: [
      "AI SEO",
      "answer engine optimization",
      "AEO",
      "Perplexity",
      "ChatGPT",
      "AI search",
    ],
    readingTimeMinutes: 8,
    sections: [
      {
        type: "p",
        content:
          "Google's dominance over search is being challenged for the first time in decades. AI-powered search engines — Perplexity, ChatGPT with browsing, Claude, Microsoft Copilot — are changing how people find information. Instead of a list of blue links, users get direct answers with cited sources. This shift demands a new optimization strategy.",
      },
      {
        type: "h2",
        content: "What Is Answer Engine Optimization (AEO)?",
      },
      {
        type: "p",
        content:
          "Answer Engine Optimization (AEO) is the practice of structuring your website's content so that AI systems can easily extract, understand, and cite it. While traditional SEO focuses on keyword rankings and backlinks, AEO focuses on clarity, structure, and machine-readability.",
      },
      {
        type: "p",
        content:
          "An AI search engine doesn't care about your domain authority score. It cares whether your content clearly and authoritatively answers the question a user is asking — and whether it can parse that answer from your page without friction.",
      },
      {
        type: "h2",
        content: "Key Differences: AI Search vs. Traditional Search",
      },
      {
        type: "ul",
        items: [
          "<strong>Context window limits</strong> — AI crawlers read a limited amount of content at once; dense, well-structured pages perform better than sprawling ones",
          "<strong>Direct answers preferred</strong> — Content that answers questions directly is more likely to be cited",
          "<strong>Machine readability matters</strong> — Clean HTML, Markdown companions, and structured data (JSON-LD) are preferred over JavaScript-heavy pages",
          "<strong>Trust signals differ</strong> — AI systems weigh factual accuracy and clarity over traditional PageRank signals",
          "<strong>Citation mechanics</strong> — AI models need clean source attribution; llms.txt and canonical URLs help",
        ],
      },
      {
        type: "h2",
        content: "1. Publish Clear, Direct Content",
      },
      {
        type: "p",
        content:
          "AI search engines excel at extracting direct answers. Structure your content with clear question-and-answer patterns. Use descriptive headings (<code>H2</code>, <code>H3</code>) that match real queries. Open each section by stating the answer directly, then elaborate.",
      },
      {
        type: "p",
        content:
          "Avoid burying answers behind walls of introductory text. If someone asks \"How do I add llms.txt to my site?\", a page that answers that question in the first paragraph after the heading will be cited over one that answers it on the third scroll.",
      },
      {
        type: "h2",
        content: "2. Implement Structured Data (JSON-LD)",
      },
      {
        type: "p",
        content:
          "JSON-LD schema markup tells AI crawlers exactly what type of content they're reading. For a blog post, use <code>BlogPosting</code> schema. For a product, use <code>Product</code>. For an FAQ, use <code>FAQPage</code>. This structured metadata helps AI systems classify and contextualize your content accurately.",
      },
      {
        type: "code",
        language: "json",
        content: `{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "How to Optimize Your Website for AI Search",
  "datePublished": "2025-04-08",
  "author": {
    "@type": "Organization",
    "name": "AI Crawlability Test"
  },
  "description": "A guide to AEO for modern AI search engines."
}`,
      },
      {
        type: "h2",
        content: "3. Add llms.txt to Your Site Root",
      },
      {
        type: "p",
        content:
          "Place a well-structured <code>llms.txt</code> file at your domain root. This file acts as a curated guide for AI agents, pointing them to your most important content and explaining what each section covers. AI agents that support the spec will use this file to orient themselves before or instead of crawling individual pages.",
      },
      {
        type: "h2",
        content: "4. Ensure Your robots.txt Allows AI Crawlers",
      },
      {
        type: "p",
        content:
          "Some sites unknowingly block AI crawlers with overly restrictive robots.txt rules. Check that your file includes explicit <code>Allow</code> rules for major AI user agents: <code>GPTBot</code>, <code>ClaudeBot</code>, <code>anthropic-ai</code>, <code>PerplexityBot</code>, and <code>Google-Extended</code>.",
      },
      {
        type: "h2",
        content: "5. Create Per-Page Markdown Files",
      },
      {
        type: "p",
        content:
          "For your most important pages — product pages, documentation, key blog posts — create companion Markdown files (e.g., <code>/about.md</code>). These provide AI agents with clean, HTML-free content that's easy to parse within a limited context window.",
      },
      {
        type: "h2",
        content: "6. Optimize for Featured Answer Formats",
      },
      {
        type: "p",
        content:
          "AI systems love content that follows a clean, answerable structure:",
      },
      {
        type: "ul",
        items: [
          "Use <strong>numbered lists</strong> for step-by-step processes",
          "Use <strong>bullet lists</strong> for features, comparisons, and tips",
          "Use <strong>definition-style headings</strong> like \"What is X?\" or \"How does Y work?\"",
          "Include a <strong>summary or TL;DR</strong> near the top of long pages",
          "Keep paragraphs short (2-4 sentences) for scannable, extractable content",
        ],
      },
      {
        type: "h2",
        content: "7. Build Topic Authority",
      },
      {
        type: "p",
        content:
          "AI search engines look for depth and breadth on a topic. A site with ten well-written, interlinked articles on AI crawlability is far more likely to be cited than a site with one thin page. Publish consistently on your core topics, link related posts together, and make sure each post thoroughly covers its subject.",
      },
      {
        type: "h2",
        content: "Measuring AEO Success",
      },
      {
        type: "p",
        content:
          "Unlike traditional SEO, AEO doesn't yet have a universal metrics dashboard. But you can track:",
      },
      {
        type: "ul",
        items: [
          "Whether Perplexity, ChatGPT, or Claude cite your site when answering relevant questions",
          "Traffic from AI referrers in your analytics (look for <code>perplexity.ai</code>, <code>chat.openai.com</code>, etc.)",
          "Coverage in AI Overviews in Google Search",
          "Your AI crawlability score using the <a href='/'>AI Crawlability Test</a>",
        ],
      },
      {
        type: "p",
        content:
          "The shift to AI-powered search is not a future event — it's happening now. Sites that adapt early will earn a structural advantage that compounds over time, just as early SEO adopters dominated Google results for years afterward.",
      },
    ],
  },
  {
    slug: "robots-txt-ai-crawlers",
    title: "robots.txt for AI Crawlers: A Complete 2025 Guide",
    description:
      "A comprehensive guide to configuring robots.txt for AI bots in 2025. Learn which user agents to allow, how to protect sensitive paths, and best practices for AI-friendly crawler configuration.",
    publishedAt: "2025-04-15",
    author: "AI Crawlability Test",
    category: "Guides",
    tags: [
      "robots.txt",
      "GPTBot",
      "ClaudeBot",
      "AI crawlers",
      "web crawlers",
      "crawl directives",
    ],
    readingTimeMinutes: 9,
    sections: [
      {
        type: "p",
        content:
          "robots.txt has been a cornerstone of web infrastructure since 1994. Originally designed to prevent crawlers from overwhelming servers, it's now the primary mechanism for controlling which AI systems can index your content. As AI crawlers proliferate, understanding how to configure robots.txt for the AI era is essential.",
      },
      {
        type: "h2",
        content: "How AI Crawlers Use robots.txt",
      },
      {
        type: "p",
        content:
          "Every major AI system — OpenAI, Anthropic, Google, Microsoft, Perplexity — deploys web crawlers to build training datasets and power real-time browsing features. These crawlers all respect robots.txt by default, though compliance policies vary. Blocking or allowing these bots via robots.txt directly affects whether your content appears in AI-generated answers.",
      },
      {
        type: "h2",
        content: "Major AI Crawler User Agents",
      },
      {
        type: "p",
        content:
          "Here are the primary AI crawler user agents you should be aware of:",
      },
      {
        type: "ul",
        items: [
          "<code>GPTBot</code> — OpenAI's crawler for training data and ChatGPT browsing",
          "<code>ChatGPT-User</code> — Used when ChatGPT browses in real time during a conversation",
          "<code>OAI-SearchBot</code> — OpenAI's search-focused crawler",
          "<code>ClaudeBot</code> — Anthropic's web crawler (training and research)",
          "<code>anthropic-ai</code> — Anthropic's general crawler identifier",
          "<code>PerplexityBot</code> — Perplexity AI's indexing crawler",
          "<code>Google-Extended</code> — Google's opt-in/opt-out token for Gemini training data",
          "<code>Googlebot</code> — Google's main crawler (also powers AI Overviews)",
          "<code>Bingbot</code> — Microsoft's crawler (powers Copilot and Bing Chat)",
          "<code>YouBot</code> — You.com's AI search crawler",
          "<code>cohere-ai</code> — Cohere's training crawler",
        ],
      },
      {
        type: "h2",
        content: "The Recommended Configuration",
      },
      {
        type: "p",
        content:
          "For most websites that want to be visible in AI search, the recommended approach is to allow all AI crawlers while blocking only sensitive paths like authentication pages and internal APIs:",
      },
      {
        type: "code",
        language: "text",
        content: `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /private/

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml`,
      },
      {
        type: "h2",
        content: "When to Block AI Crawlers",
      },
      {
        type: "p",
        content:
          "There are legitimate reasons to block AI crawlers on certain paths or entirely:",
      },
      {
        type: "ul",
        items: [
          "<strong>Paywalled content</strong> — Block crawlers from accessing subscriber-only pages",
          "<strong>Sensitive user data</strong> — Prevent crawling of pages containing personal information",
          "<strong>Duplicate content</strong> — Block paginated, filtered, or parameter-heavy URLs that add noise without value",
          "<strong>Training data opt-out</strong> — Use <code>Google-Extended</code> block if you don't want content in Gemini training while still appearing in Googlebot results",
          "<strong>Unstable pages</strong> — Block pages under development or with placeholder content",
        ],
      },
      {
        type: "h2",
        content: "Selective Opt-Out Example",
      },
      {
        type: "p",
        content:
          "To opt out of AI training data while keeping search visibility, use selective blocking. For example, to allow general Googlebot but opt out of Gemini training:",
      },
      {
        type: "code",
        language: "text",
        content: `# Allow normal search indexing
User-agent: Googlebot
Allow: /

# Opt out of AI training data for Google
User-agent: Google-Extended
Disallow: /

# Allow AI browsing/answer features
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /`,
      },
      {
        type: "h2",
        content: "Always Include a Sitemap Reference",
      },
      {
        type: "p",
        content:
          "The <code>Sitemap:</code> directive at the bottom of robots.txt is crucial. It tells all crawlers — including AI crawlers that may not know your URL structure — where to find a complete list of your pages. Without it, crawlers may miss large portions of your site.",
      },
      {
        type: "code",
        language: "text",
        content: "Sitemap: https://yourdomain.com/sitemap.xml",
      },
      {
        type: "h2",
        content: "Common Mistakes to Avoid",
      },
      {
        type: "ul",
        items: [
          "Using a catch-all <code>Disallow: /</code> under <code>User-agent: *</code> — this blocks all crawlers including AI",
          "Blocking <code>/assets/</code> or <code>/static/</code> — AI crawlers may need CSS/JS context to render pages",
          "Not including a <code>Sitemap:</code> directive — means crawlers rely on link discovery alone",
          "Forgetting to test your robots.txt with Google Search Console or a robots.txt validator",
          "Using regex patterns — robots.txt only supports simple wildcards (<code>*</code>) and end-of-line anchors (<code>$</code>)",
        ],
      },
      {
        type: "h2",
        content: "Testing Your robots.txt",
      },
      {
        type: "p",
        content:
          "After creating or updating your robots.txt, test it thoroughly. Use the <a href='/'>AI Crawlability Test</a> to verify the file is accessible and that key directives are present. Google Search Console also provides a robots.txt testing tool for Googlebot-specific validation.",
      },
      {
        type: "p",
        content:
          "Remember: robots.txt rules are a statement of intent, not an enforcement mechanism. Well-behaved crawlers respect them; malicious bots typically don't. For sensitive content, rely on authentication and access controls rather than robots.txt alone.",
      },
    ],
  },
  {
    slug: "json-ld-structured-data",
    title: "JSON-LD and Structured Data: Making Your Content AI-Readable",
    description:
      "A practical guide to implementing JSON-LD structured data markup on your website to improve visibility in AI search engines, rich results, and knowledge graphs.",
    publishedAt: "2025-04-22",
    author: "AI Crawlability Test",
    category: "Technical SEO",
    tags: [
      "JSON-LD",
      "structured data",
      "schema.org",
      "rich snippets",
      "technical SEO",
      "AI readability",
    ],
    readingTimeMinutes: 10,
    sections: [
      {
        type: "p",
        content:
          "Structured data is the bridge between your web content and the machines that read it. While humans can infer context from layout, images, and prose, AI systems and search engines need explicit, machine-readable signals to classify and understand your content correctly. JSON-LD provides exactly that — without changing how your page looks to visitors.",
      },
      {
        type: "h2",
        content: "What Is JSON-LD?",
      },
      {
        type: "p",
        content:
          "JSON-LD (JavaScript Object Notation for Linked Data) is a lightweight format for embedding structured data in web pages. It uses the <code>schema.org</code> vocabulary — a collaborative project backed by Google, Microsoft, Yahoo, and Yandex — to describe entities, relationships, and properties in a way machines can reliably interpret.",
      },
      {
        type: "p",
        content:
          "Unlike microdata (which embeds attributes directly in HTML elements) or RDFa, JSON-LD sits in a separate <code>&lt;script&gt;</code> tag. This clean separation means you can add, update, or remove it without touching your visual HTML:",
      },
      {
        type: "code",
        language: "html",
        content: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "JSON-LD and Structured Data Guide",
  "author": {
    "@type": "Organization",
    "name": "AI Crawlability Test"
  },
  "datePublished": "2025-04-22"
}
</script>`,
      },
      {
        type: "h2",
        content: "Why Structured Data Matters for AI",
      },
      {
        type: "p",
        content:
          "Traditional SEO has long valued structured data for rich results (star ratings, FAQ dropdowns, recipe cards in Google). For AI systems, structured data serves an even deeper purpose: it eliminates ambiguity.",
      },
      {
        type: "ul",
        items: [
          "AI models can classify your content type (<code>BlogPosting</code>, <code>Product</code>, <code>FAQPage</code>) without inferring it from prose",
          "Author, publication date, and organization information is machine-verified rather than guessed",
          "Product prices, availability, and specifications can be read directly",
          "FAQ schema enables direct question-answer extraction for AI responses",
          "Breadcrumb schema helps AI understand your site hierarchy",
        ],
      },
      {
        type: "h2",
        content: "Most Valuable Schema Types for AI Visibility",
      },
      {
        type: "h3",
        content: "WebSite Schema",
      },
      {
        type: "p",
        content:
          "Add <code>WebSite</code> schema to your homepage to identify your site, enable sitelinks search box, and establish your brand's canonical online identity:",
      },
      {
        type: "code",
        language: "json",
        content: `{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "My Brand",
  "url": "https://example.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://example.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}`,
      },
      {
        type: "h3",
        content: "Article / BlogPosting Schema",
      },
      {
        type: "p",
        content:
          "Every blog post and article should have <code>BlogPosting</code> or <code>Article</code> schema. This signals to AI crawlers that the content is editorial, attributes it to an author, and provides temporal context through publication date:",
      },
      {
        type: "code",
        language: "json",
        content: `{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Your Post Title",
  "description": "Short description for AI context.",
  "datePublished": "2025-04-22",
  "dateModified": "2025-04-22",
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "https://example.com/author/name"
  },
  "publisher": {
    "@type": "Organization",
    "name": "My Brand",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://example.com/blog/post-slug"
  }
}`,
      },
      {
        type: "h3",
        content: "FAQPage Schema",
      },
      {
        type: "p",
        content:
          "FAQ schema is arguably the most powerful for AI visibility. It literally provides question-answer pairs that AI systems can extract and use directly in responses:",
      },
      {
        type: "code",
        language: "json",
        content: `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is llms.txt?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "llms.txt is a plain-text Markdown file placed at your domain root that provides AI agents with a structured overview of your site's content."
      }
    },
    {
      "@type": "Question",
      "name": "Does my website need structured data?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Structured data helps AI systems and search engines accurately classify and cite your content."
      }
    }
  ]
}`,
      },
      {
        type: "h2",
        content: "Implementing JSON-LD in Next.js",
      },
      {
        type: "p",
        content:
          "In Next.js, add JSON-LD to your layout or page component as a <code>&lt;script&gt;</code> tag. Place it in the <code>&lt;head&gt;</code> via the layout file for site-wide schemas, or in individual page components for page-specific schemas:",
      },
      {
        type: "code",
        language: "typescript",
        content: `// app/layout.tsx or app/blog/[slug]/page.tsx
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.title,
  datePublished: post.publishedAt,
  author: { "@type": "Organization", name: "My Site" },
}

return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    {/* page content */}
  </>
)`,
      },
      {
        type: "h2",
        content: "Validating Your Structured Data",
      },
      {
        type: "p",
        content: "Before deploying, validate your JSON-LD markup using:",
      },
      {
        type: "ul",
        items: [
          "<strong>Google Rich Results Test</strong> — Tests whether your markup qualifies for rich results",
          "<strong>Schema Markup Validator</strong> (schema.org/SchemaMarkupValidator) — Validates schema.org compliance",
          "<strong>AI Crawlability Test</strong> — Check if your structured data is detected alongside your other AI-readiness signals",
        ],
      },
      {
        type: "h2",
        content: "Common JSON-LD Mistakes",
      },
      {
        type: "ul",
        items: [
          "Using the wrong schema type (e.g., <code>Article</code> instead of <code>BlogPosting</code> for blog content)",
          "Missing required properties (<code>headline</code>, <code>datePublished</code>, <code>author</code> for articles)",
          "Invalid JSON syntax — use a linter to validate before deploying",
          "Describing content that doesn't match the visible page (Google penalizes misleading schema)",
          "Placing JSON-LD inside the <code>&lt;body&gt;</code> rather than <code>&lt;head&gt;</code> — both work, but <code>&lt;head&gt;</code> is preferred",
        ],
      },
      {
        type: "p",
        content:
          "Structured data is one of the highest-leverage SEO investments you can make right now. It benefits both traditional search (rich results, knowledge panels) and AI search (accurate classification, better citation). Implement it once and it works silently in the background, making every piece of content you publish more visible to machines.",
      },
    ],
  },
  {
    slug: "ai-crawlability-guide-2025",
    title: "The Complete Guide to AI Crawlability in 2025",
    description:
      "Everything you need to make your website visible to AI search engines and agents. A comprehensive checklist covering llms.txt, robots.txt, sitemaps, structured data, Open Graph, and per-page markdown.",
    publishedAt: "2025-04-29",
    author: "AI Crawlability Test",
    category: "Guides",
    tags: [
      "AI crawlability",
      "AI SEO",
      "website optimization",
      "AI agents",
      "complete guide",
      "2025",
    ],
    readingTimeMinutes: 12,
    sections: [
      {
        type: "p",
        content:
          "The rules of web visibility are being rewritten. In 2025, being found online no longer means ranking on page one of Google. It means being cited, summarized, and recommended by AI systems — ChatGPT, Claude, Perplexity, Gemini — that millions of people use daily as their primary interface to information. This guide covers everything you need to achieve that visibility.",
      },
      {
        type: "h2",
        content: "What Is AI Crawlability?",
      },
      {
        type: "p",
        content:
          "AI crawlability refers to how effectively AI agents and crawlers can discover, access, read, and understand your website's content. It encompasses both technical accessibility (can bots reach your content?) and semantic clarity (can they understand what it means?).",
      },
      {
        type: "p",
        content:
          "A highly crawlable site has all of the following: explicit permissions for AI crawlers, a complete sitemap, a curated llms.txt manifest, structured data markup, clean content in Markdown-accessible formats, and proper metadata. Let's work through each layer.",
      },
      {
        type: "h2",
        content: "Layer 1: Access — robots.txt",
      },
      {
        type: "p",
        content:
          "Before anything else, AI crawlers need permission to access your site. Your <code>robots.txt</code> file is the gatekeeper. Ensure it:",
      },
      {
        type: "ul",
        items: [
          "Exists at <code>yourdomain.com/robots.txt</code>",
          "Contains a <code>User-agent: *</code> directive (applies to all crawlers)",
          "Does not have a blanket <code>Disallow: /</code> that blocks everything",
          "Explicitly allows key AI crawlers: <code>GPTBot</code>, <code>ClaudeBot</code>, <code>anthropic-ai</code>, <code>PerplexityBot</code>",
          "Includes a <code>Sitemap:</code> directive pointing to your sitemap.xml",
          "Blocks only what's truly private: <code>/admin/</code>, <code>/api/</code>, authentication pages",
        ],
      },
      {
        type: "h2",
        content: "Layer 2: Discovery — sitemap.xml",
      },
      {
        type: "p",
        content:
          "AI crawlers can only index pages they can find. Your sitemap.xml is a complete, structured list of every URL on your site. Without it, crawlers rely on link discovery — meaning they'll find your homepage but may miss deep pages, old blog posts, or product pages without inbound links.",
      },
      {
        type: "ul",
        items: [
          "Generate a dynamic sitemap that automatically includes new pages",
          "Submit it to Google Search Console and Bing Webmaster Tools",
          "Reference it in robots.txt for direct crawler discovery",
          "Include <code>&lt;lastmod&gt;</code> dates so crawlers prioritize recently updated content",
          "For large sites, use a sitemap index file linking to multiple sub-sitemaps",
        ],
      },
      {
        type: "h2",
        content: "Layer 3: Comprehension — llms.txt",
      },
      {
        type: "p",
        content:
          "While sitemap.xml helps crawlers find pages, <code>llms.txt</code> helps AI agents <em>understand</em> your site. Place this Markdown file at your domain root with a title, a one-line description, and curated sections linking to your most important content with brief descriptions.",
      },
      {
        type: "p",
        content:
          "An AI agent reading your llms.txt can immediately understand what your site is about and navigate directly to the most relevant content, without crawling dozens of pages to piece together the same picture. This is especially valuable for sites with complex information architecture.",
      },
      {
        type: "h2",
        content: "Layer 4: Metadata — Open Graph and Twitter Cards",
      },
      {
        type: "p",
        content:
          "Open Graph and Twitter Card meta tags provide structured previews of your content. They're read by AI agents when generating link previews, summaries, and citations. Every page should have:",
      },
      {
        type: "ul",
        items: [
          "<code>og:title</code> — Clear, descriptive title for the page",
          "<code>og:description</code> — 1-2 sentence description of the content",
          "<code>og:type</code> — <code>website</code>, <code>article</code>, or <code>product</code>",
          "<code>og:url</code> — Canonical URL for the page",
          "<code>og:image</code> — A representative image (1200×630px recommended)",
          "<code>twitter:card</code> — Set to <code>summary_large_image</code> for article content",
        ],
      },
      {
        type: "h2",
        content: "Layer 5: Semantic Structure — JSON-LD",
      },
      {
        type: "p",
        content:
          "JSON-LD structured data lets you explicitly declare what type of content each page contains, who created it, and what it's about. This eliminates the guesswork AI systems otherwise have to do when classifying content.",
      },
      {
        type: "p",
        content:
          "Key schema types to implement: <code>WebSite</code> on the homepage, <code>BlogPosting</code> on each article, <code>FAQPage</code> on FAQ sections, <code>Product</code> on product pages, and <code>Organization</code> on the about page. In Next.js, inject these as <code>&lt;script type=\"application/ld+json\"&gt;</code> tags in the <code>&lt;head&gt;</code>.",
      },
      {
        type: "h2",
        content: "Layer 6: Content Accessibility — Per-Page Markdown",
      },
      {
        type: "p",
        content:
          "For your most important pages, provide companion Markdown files. A page at <code>/blog/my-post</code> gets a companion at <code>/blog/my-post.md</code>. AI agents that prefer Markdown — cleaner, lighter, no HTML overhead — can read these directly. Your llms.txt should link to the <code>.md</code> versions of your pages.",
      },
      {
        type: "h2",
        content: "Layer 7: Technical SEO Foundations",
      },
      {
        type: "p",
        content:
          "Don't neglect the fundamentals that also help AI crawlers:",
      },
      {
        type: "ul",
        items: [
          "<strong>Canonical URLs</strong> — Use <code>&lt;link rel=\"canonical\"&gt;</code> to prevent duplicate content confusion",
          "<strong>Fast page load</strong> — AI crawlers have timeout limits; slow pages may be skipped",
          "<strong>HTTPS</strong> — Crawlers give lower trust to HTTP-only sites",
          "<strong>Descriptive URLs</strong> — <code>/blog/what-is-llms-txt</code> over <code>/blog/post-3421</code>",
          "<strong>Internal linking</strong> — Helps crawlers discover all pages from any entry point",
          "<strong>Mobile-friendly</strong> — Affects Googlebot's crawl budget and indexing quality",
        ],
      },
      {
        type: "h2",
        content: "The AI Crawlability Checklist",
      },
      {
        type: "p",
        content: "Use this checklist to audit your site:",
      },
      {
        type: "ol",
        items: [
          "robots.txt exists and explicitly allows AI crawlers",
          "robots.txt includes a Sitemap: directive",
          "sitemap.xml is present, complete, and updated automatically",
          "llms.txt exists at the domain root with title, description, and content sections",
          "All pages have og:title, og:description, and og:url meta tags",
          "Homepage has WebSite JSON-LD schema",
          "Blog posts have BlogPosting JSON-LD schema",
          "FAQs have FAQPage JSON-LD schema",
          "Key pages have companion .md files",
          "llms.txt links to .md versions of important pages",
          "Canonical URLs are set on all pages",
          "Site loads quickly and is accessible over HTTPS",
        ],
      },
      {
        type: "h2",
        content: "Running Your Audit",
      },
      {
        type: "p",
        content:
          "You can check many of these items automatically. The <a href='/'>AI Crawlability Test</a> tool checks your llms.txt, robots.txt, sitemap.xml, and per-page Markdown files in real time — just enter your URL to see an instant report.",
      },
      {
        type: "callout",
        content:
          "AI search is not replacing traditional SEO — it's layering on top of it. Sites that optimize for both will dominate visibility in 2025 and beyond. The good news: most of the work is technical and one-time. Set it up correctly once, and your site earns compounding returns as AI search grows.",
      },
    ],
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug)
}

export function getRelatedPosts(slug: string, count = 3): BlogPost[] {
  return BLOG_POSTS.filter((post) => post.slug !== slug).slice(0, count)
}
