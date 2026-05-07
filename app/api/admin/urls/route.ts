import { NextRequest, NextResponse } from "next/server"
import { kv } from "@vercel/kv"

export async function GET(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "")
  if (!process.env.ADMIN_SECRET || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const raw = await kv.lrange<string>("checked_urls", 0, -1)
  const entries = raw.map((item) => {
    try { return JSON.parse(item) } catch { return { url: item, at: null } }
  })

  return NextResponse.json({ count: entries.length, entries })
}
