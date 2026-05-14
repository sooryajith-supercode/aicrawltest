# MCP Server Cards: How AI Agents Discover Your Site's Tools

> What the Model Context Protocol server card is, why /.well-known/mcp.json matters, and how to publish one so AI agents can discover and use your site's tools.

**Published:** May 14, 2026 | **Reading time:** 7 minutes | **Category:** Technical

## What Is the Model Context Protocol?

The **Model Context Protocol (MCP)** is an open standard developed by Anthropic that defines how AI models connect to external tools, data sources, and services. Any agent supporting MCP can call your tools without custom integration code.

## What Is an MCP Server Card?

An MCP Server Card is a JSON document at `/.well-known/mcp.json` that answers: *What is this server? What can it do? How should an agent authenticate?*

## Server Card Structure

```json
{
  "name": "Acme Docs MCP",
  "description": "Search and fetch Acme product documentation.",
  "version": "1.0.0",
  "endpoint": "https://acme.com/mcp",
  "protocol": "mcp",
  "protocolVersion": "2024-11-05",
  "auth": {
    "type": "oauth2",
    "authorizationUrl": "https://acme.com/oauth/authorize",
    "tokenUrl": "https://acme.com/oauth/token",
    "scopes": ["docs:read"]
  },
  "tools": [
    {
      "name": "search_docs",
      "description": "Search the documentation by keyword",
      "inputSchema": {
        "type": "object",
        "properties": {
          "query": { "type": "string" }
        },
        "required": ["query"]
      }
    }
  ]
}
```

## How Agents Use the Server Card

1. Agent fetches `/.well-known/mcp.json`
2. Reads tool definitions and auth requirements
3. Authenticates if required
4. Connects to the endpoint and calls tools

## Advertising via Link Header

```http
Link: </.well-known/mcp.json>; rel="mcp-server-card"
```

## Tools to Expose

- `search` — Query your content by keyword
- `get_page` — Return full text of a specific page
- `list_articles` / `list_products` — Enumerate your inventory
- `create_ticket` — Action tools for service workflows

## Related Reading

- [Link Response Headers for Agent Discovery (RFC 8288)](/blog/link-headers-agent-discovery.md)
- [API, OAuth, and OIDC Discovery for AI Agents](/blog/api-oauth-agent-discovery.md)
- [Test your site's AI crawlability](/)
