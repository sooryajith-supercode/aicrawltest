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
}

export default nextConfig
