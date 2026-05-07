# What is llms.txt and Why Every Website Needs One

> Learn about the llms.txt specification — the emerging standard that helps AI agents and large language models understand and navigate your website's content.

**Published:** April 1, 2025 | **Reading time:** 7 minutes | **Category:** Guides

## What Is llms.txt?

llms.txt is a plain-text Markdown file placed at the root of your website (`/llms.txt`). It provides AI agents with a structured, human-readable overview of your site: what it does, what content it contains, and where to find key pages. Think of it as a table of contents written specifically for artificial intelligence.

The specification was introduced by fast.ai and documented at llmstxt.org. It defines a minimal format: a title, an optional description, and a list of sections containing links with short descriptions.

## The llms.txt Format

A valid llms.txt file looks like this:

```
# My Company

> We build developer tools for the AI era.

## Documentation

- [Getting Started](/docs/start.md): How to set up and run your first project.
- [API Reference](/docs/api.md): Complete reference for all API endpoints.

## Blog

- [What is llms.txt](/blog/what-is-llms-txt.md): Introduction to the llms.txt standard.
```

## Why AI Agents Need llms.txt

When a large language model visits a website, it often needs to answer a specific question quickly. Without guidance, it must crawl multiple pages, parse HTML, ignore navigation and ads, and piece together a mental model of your site — all within a limited context window.

llms.txt eliminates this friction. Key benefits:

- AI agents can answer questions about your site accurately without guessing
- Reduces the chance of LLMs hallucinating incorrect information about your brand
- Helps AI-powered search surfaces (Perplexity, ChatGPT, Claude) cite your content
- Works alongside per-page `.md` files for granular content access
- Future-proofs your site as AI browsing becomes mainstream

## llms.txt vs. Other Crawl Files

- **robots.txt** — Controls *access*: which bots can visit which paths
- **sitemap.xml** — Controls *discovery*: lists all URLs so crawlers know what exists
- **llms.txt** — Controls *comprehension*: explains what your site is about and where key content lives

## Per-Page Markdown Companions

llms.txt often links to Markdown versions of your pages (e.g., `/about.md` alongside `/about`). These per-page Markdown files give AI agents clean, distraction-free content — no navigation, no ads, no JavaScript. Pure text.

## How to Create Your llms.txt Today

1. Open a text editor and create a file named `llms.txt`
2. Add a `#` heading with your site or brand name
3. Add a `>` blockquote with a one-sentence description of your site
4. Create `##` sections for major content areas (Docs, Blog, Products, etc.)
5. List your most important pages as Markdown links with descriptions
6. Place the file at the root of your site (accessible at `yoursite.com/llms.txt`)
7. Optionally add `/.well-known/llms.txt` as a mirror

## Related Reading

- [How to Optimize Your Website for AI Search Engines](/blog/optimize-for-ai-search.md)
- [The Complete Guide to AI Crawlability in 2025](/blog/ai-crawlability-guide-2025.md)
- [Test your site's AI crawlability](/)
