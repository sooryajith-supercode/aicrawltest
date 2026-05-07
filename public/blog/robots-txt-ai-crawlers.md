# robots.txt for AI Crawlers: A Complete 2025 Guide

> A comprehensive guide to configuring robots.txt for AI bots in 2025. Learn which user agents to allow, how to protect sensitive paths, and best practices for AI-friendly crawler configuration.

**Published:** April 15, 2025 | **Reading time:** 9 minutes | **Category:** Guides

## How AI Crawlers Use robots.txt

Every major AI system — OpenAI, Anthropic, Google, Microsoft, Perplexity — deploys web crawlers to build training datasets and power real-time browsing features. These crawlers all respect robots.txt by default.

## Major AI Crawler User Agents

- `GPTBot` — OpenAI's crawler for training data and ChatGPT browsing
- `ChatGPT-User` — Used when ChatGPT browses in real time during a conversation
- `OAI-SearchBot` — OpenAI's search-focused crawler
- `ClaudeBot` — Anthropic's web crawler (training and research)
- `anthropic-ai` — Anthropic's general crawler identifier
- `PerplexityBot` — Perplexity AI's indexing crawler
- `Google-Extended` — Google's opt-in/opt-out token for Gemini training data
- `Googlebot` — Google's main crawler (also powers AI Overviews)
- `Bingbot` — Microsoft's crawler (powers Copilot and Bing Chat)
- `YouBot` — You.com's AI search crawler
- `cohere-ai` — Cohere's training crawler

## The Recommended Configuration

```
User-agent: *
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

Sitemap: https://yourdomain.com/sitemap.xml
```

## When to Block AI Crawlers

- **Paywalled content** — Block crawlers from accessing subscriber-only pages
- **Sensitive user data** — Prevent crawling of pages containing personal information
- **Duplicate content** — Block paginated, filtered, or parameter-heavy URLs
- **Training data opt-out** — Use `Google-Extended` block if you don't want content in Gemini training
- **Unstable pages** — Block pages under development

## Always Include a Sitemap Reference

The `Sitemap:` directive at the bottom of robots.txt is crucial. It tells all crawlers where to find a complete list of your pages.

```
Sitemap: https://yourdomain.com/sitemap.xml
```

## Common Mistakes to Avoid

- Using a catch-all `Disallow: /` under `User-agent: *` — this blocks all crawlers including AI
- Blocking `/assets/` or `/static/` — AI crawlers may need CSS/JS context to render pages
- Not including a `Sitemap:` directive
- Forgetting to test your robots.txt with Google Search Console
- Using regex patterns — robots.txt only supports simple wildcards

## Related Reading

- [How to Optimize Your Website for AI Search Engines](/blog/optimize-for-ai-search.md)
- [The Complete Guide to AI Crawlability in 2025](/blog/ai-crawlability-guide-2025.md)
- [Test your robots.txt now](/)
