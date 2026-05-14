# API, OAuth, and OIDC Discovery for AI Agents: A Practical Guide

> How AI agents discover your API capabilities and authentication requirements — covering OpenAPI specs, ai-plugin.json, OAuth AS metadata (RFC 8414), and OIDC discovery.

**Published:** May 14, 2026 | **Reading time:** 8 minutes | **Category:** Technical

## OpenAPI: Your API's Machine-Readable Contract

Publish an OpenAPI spec at `/openapi.json` and declare it via a Link header (`rel="service-desc"`). The `operationId` field is used by agents as the function name when deciding which call to make — keep it descriptive.

## ai-plugin.json — The ChatGPT Plugin Format

`/.well-known/ai-plugin.json` wraps your OpenAPI spec with agent-friendly metadata:

```json
{
  "schema_version": "v1",
  "name_for_human": "Acme Search",
  "name_for_model": "acme_search",
  "description_for_model": "Search Acme products and documentation. Use when user asks about Acme products, pricing, or support.",
  "auth": { "type": "none" },
  "api": { "type": "openapi", "url": "https://acme.com/openapi.json" }
}
```

The `description_for_model` tells agents *when* to use your API — write it carefully.

## OAuth Authorization Server Metadata — RFC 8414

Published at `/.well-known/oauth-authorization-server`, this document gives agents everything needed to complete an OAuth flow automatically:

```json
{
  "issuer": "https://auth.acme.com",
  "authorization_endpoint": "https://auth.acme.com/oauth/authorize",
  "token_endpoint": "https://auth.acme.com/oauth/token",
  "scopes_supported": ["read", "write"],
  "grant_types_supported": ["authorization_code", "client_credentials"]
}
```

## OIDC Discovery

For OIDC providers, `/.well-known/openid-configuration` is a superset of OAuth AS metadata. Most hosted identity providers (Auth0, Okta, Clerk, Supabase) publish this automatically.

## OAuth Protected Resource Metadata — RFC 9728

Published at `/.well-known/oauth-protected-resource`, this document links your API to its authorization server:

```json
{
  "resource": "https://api.acme.com",
  "authorization_servers": ["https://auth.acme.com"],
  "scopes_supported": ["read", "write"]
}
```

## The Full Agentic Discovery Chain

1. Agent `HEAD` request → reads `Link` header
2. Finds `/openapi.json` via `rel="service-desc"` → reads API schema
3. Sees auth requirement → fetches `/.well-known/oauth-protected-resource`
4. Discovers auth server → fetches `/.well-known/oauth-authorization-server`
5. Completes OAuth flow → obtains scoped token
6. Calls API with token

**Where to start:** Publish `/openapi.json` and add `Link: </openapi.json>; rel="service-desc"` to your responses. That single step makes your API discoverable to most AI agents today.

## Related Reading

- [Link Response Headers for Agent Discovery (RFC 8288)](/blog/link-headers-agent-discovery.md)
- [MCP Server Cards: How AI Agents Discover Your Site's Tools](/blog/mcp-server-card.md)
- [Test your site's AI crawlability](/)
