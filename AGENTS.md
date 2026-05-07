<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Known build pitfalls (learned from this project)

**No event handlers in server components.**
Any file without `"use client"` at the top is a server component. `onMouseEnter`, `onMouseLeave`, `onClick`, etc. will cause a hard build failure at static-generation time:
> Error: Event handlers cannot be passed to Client Component props.

Fix options (in order of preference):
1. Use a CSS class (e.g. `.hover-accent:hover { color: … }` in `globals.css`) instead of inline JS handlers.
2. Extract the interactive element into a separate small `"use client"` component.
3. Add `"use client"` to the whole page — but this disables `generateMetadata` and `generateStaticParams` in that file, so prefer options 1 or 2 for pages that need those exports.

**`params` is a Promise in this version.**
In `app/[slug]/page.tsx`, params must be awaited: `const { slug } = await params`. Treat it as `Promise<{ slug: string }>` in the Props type.
<!-- END:nextjs-agent-rules -->
