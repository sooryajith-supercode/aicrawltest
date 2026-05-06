# AI Crawlability Test

Free tool to check whether your website has the key files AI crawlers and agents look for.

## What it checks

**llms.txt** — The emerging AI-readable site manifest that tells LLMs how to interact with your site. Introduced at llmstxt.org, it provides a structured overview of your site's content for AI agents.

**robots.txt** — Standard crawl-control file. Verifies it exists and parses directives including `User-agent: *`, `Disallow`, `Allow`, and `Sitemap` entries.

**sitemap.xml** — Checks for a sitemap across common paths and via any `Sitemap:` directive declared in robots.txt.

## How to use

Enter your website's URL (e.g. `yourwebsite.com`) and click **Check site**. Results appear instantly — each file is checked live against your site in real time, not from a cache.

## Why it matters

ChatGPT, Claude, Perplexity, and AI-powered browsers are rapidly replacing traditional search as the way people find information. If your website isn't structured for AI crawlers, you risk becoming invisible — even if you rank well on Google today.
