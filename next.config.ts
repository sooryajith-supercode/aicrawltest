import type { NextConfig } from "next"
import { execSync } from "child_process"

let gitHash = "dev"
try {
  gitHash = execSync("git rev-parse --short HEAD").toString().trim()
} catch {
  // not a git repo or git unavailable (e.g. some CI environments)
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: gitHash,
  },
}

export default nextConfig
