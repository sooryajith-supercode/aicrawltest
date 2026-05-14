# Link Response Headers for Agent Discovery — RFC 8288 Explained

> How HTTP Link headers enable AI agents to discover your site's key resources without parsing HTML — and how to add them to your site in minutes.

**Published:** May 14, 2026 | **Reading time:** 6 minutes | **Category:** Technical

## What Are HTTP Link Headers?

HTTP `Link` headers are returned in the server response alongside status codes and content-type — before any HTML body is downloaded. An agent can issue a `HEAD` request and immediately know where your OpenAPI spec lives, that a Markdown version of the page exists, and where your AI manifest is. No HTML parsing required.

```http
HTTP/1.1 200 OK
Content-Type: text/html
Link: </llms.txt>; rel="ai-manifest"
Link: </openapi.json>; rel="service-desc"
Link: </about.md>; rel="alternate"; type="text/markdown"
```

## Key rel Values for AI Agent Discovery

- `rel="service-desc"` — Points to an OpenAPI or service description document (RFC 8631)
- `rel="describedby"` — Points to documentation or a schema describing the current page
- `rel="alternate" type="text/markdown"` — Declares a Markdown version of the page
- `rel="hub"` — Points to a WebSub hub for real-time update subscriptions
- `rel="ai-manifest"` — Emerging convention pointing to your `llms.txt`
- `rel="canonical"` — Authoritative URL for deduplication
- `rel="mcp"` — Points to an MCP server card

## Why Agents Prefer Headers Over HTML

AI crawlers operate under tight constraints: limited context windows and cost per token. HTTP headers are available even for JavaScript-rendered SPAs — the `Link` header is part of the raw HTTP response regardless of whether your app hydrates in the browser.

## Implementing in Next.js

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Link",
            value: '</llms.txt>; rel="ai-manifest", </openapi.json>; rel="service-desc"',
          },
        ],
      },
    ]
  },
}
export default nextConfig
```

## Implementing in nginx

```nginx
server {
  add_header Link '</llms.txt>; rel="ai-manifest"' always;
  add_header Link '</openapi.json>; rel="service-desc"' always;
}
```

## Related Reading

- [MCP Server Cards: How AI Agents Discover Your Site's Tools](/blog/mcp-server-card.md)
- [API, OAuth, and OIDC Discovery for AI Agents](/blog/api-oauth-agent-discovery.md)
- [Test your site's AI crawlability](/)
