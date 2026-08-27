# OllaSync Blog

The Astro-powered blog for **OllaSync**, published at **https://blogs.ollasync.com**.

> ✍️ **Writing a post?** See **[CONTRIBUTING.md](./CONTRIBUTING.md)** — you only ever touch
> Markdown files in `src/content/blog/`. Everything else is maintained by NH Ops.

## How it works

- **Astro** static site. Posts are Markdown in `src/content/blog/`.
- Push to `main` → GitHub Actions on an NH **self-hosted runner** (`nh-marketing`, LXC 505) →
  `npm run build` → `wrangler pages deploy` to the Cloudflare Pages project **`ollasync-blog`** →
  live at `blogs.ollasync.com`.
- Branding lives in one file: [`src/config.ts`](./src/config.ts).

Requires Node 22+. **Do not commit a lock file** (breaks the Linux CI build). Maintained by NH Ops.
