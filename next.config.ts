import type { NextConfig } from "next"
import { execSync } from "child_process"
import { version } from "./package.json"

let gitHash = "dev"
try {
  gitHash = execSync("git rev-parse --short HEAD").toString().trim()
} catch {
  // not a git repo or git unavailable
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: `${version}-${gitHash}`,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Link",
            value: [
              '</llms.txt>; rel="ai-manifest"',
              '</sitemap.xml>; rel="sitemap"',
              '</openapi.json>; rel="service-desc"',
            ].join(", "),
          },
        ],
      },
    ]
  },
}

export default nextConfig
