# AI Crawlability Test

A tool to test how well your website is crawlable by AI agents and LLMs. Checks for `llms.txt`, `robots.txt`, sitemaps, per-page markdown files, and more — with live results.

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the tool.

## What It Checks

- `llms.txt` — AI-readable site summary
- `robots.txt` — crawler permissions
- `sitemap.xml` — page discovery
- Per-page `.md` files — structured content for LLMs
- Meta tags — AI-relevant metadata

## Version

Version is displayed in the header as `v{semver}-{git-hash}` and updates automatically on each build.

## Deploy

```bash
npm run build
npm run start
```
