# Writing for this blog

When you commit a post to the `main` branch, it builds and goes **live automatically in about a minute**.
You don't need to run anything, and you don't need to open a pull request — just commit straight to `main`.

## What you can edit

✅ **Add or edit posts** in `src/content/blog/` — one Markdown (`.md`) file per post.
✅ **Add images** in `public/` and reference them as `/my-image.png`.

Please leave everything else alone (layout, styling, build, deploy config) — changing those files can break
the site build. If something you need is in one of those files, ping NH Ops.

## Add a new post (right in GitHub — the easy way)

1. Open the **`src/content/blog/`** folder in this repo.
2. Click **Add file → Create new file**.
3. Name it lowercase-with-dashes, ending in `.md` — e.g. `best-vpn-for-android.md`.
   **The filename becomes the URL:** `/blog/best-vpn-for-android/`.
4. Paste the template below and write your post.
5. Scroll down, keep **“Commit directly to the `main` branch”** selected, and click **Commit changes**.

Done — your post is live in ~1 minute. Editing an existing post is the same: open the `.md` file, click the
pencil ✏️, make changes, and **Commit changes** to `main`.

## Post template

```markdown
---
title: 'Your headline here'
description: 'One or two sentences for search results and social cards (~150 chars).'
pubDate: 2026-08-27
author: 'Your Name'
tags: ['guides', 'privacy']
---

Write your post here in **Markdown**.

## A section heading

- bullet points
- work fine

Add a link like [this](https://example.com), or an image: `![alt text](/my-image.png)`.
```

### Frontmatter fields (the part between the `---` lines)

| Field         | Required | Notes                                                        |
| ------------- | -------- | ------------------------------------------------------------ |
| `title`       | yes      | The headline.                                                |
| `description` | yes      | ~150 chars. Shows in Google + social previews.               |
| `tldr`        | no       | Verbatim TL;DR paragraph from the draft. Shows in TL;DR box. |
| `pubDate`     | yes      | `YYYY-MM-DD`. Controls ordering (newest first).              |
| `author`      | no       | Defaults to the site author.                                 |
| `tags`        | no       | A list, e.g. `['guides', 'privacy']`. Creates tag pages.     |
| `cover`       | no       | Path to a header image in `public/`, e.g. `/covers/foo.png`. |
| `takeaways`   | no       | Array of 4-5 bullet summary strings.                         |
| `draft`       | no       | `true` hides the post from the live site while you write.    |

## Blog Posting Checklist (Rules to Follow Every Time)

1. **Verbatim Content Preservation:**
   - Keep the main content from the author's draft `.txt` file **completely untouched**. Do not summarize, shorten, or rewrite any paragraphs or sections.
2. **Exact TL;DR from Text File:**
   - Always copy the exact `TLDR` paragraph from the `.txt` draft into the frontmatter `tldr:` field. It will display in the site's signature TL;DR card. Never invent or rewrite a TLDR.
3. **Checklists as Clean Bullets (No Checkboxes):**
   - Format checklist items as standard bullet points (`- **Item:** ...`). Never use interactive Markdown checkboxes (`- [ ]`) because they render HTML tick boxes on the page.
4. **Clean Categorical Tags & SEO Keywords:**
   - Short categories in `tags:` (e.g. `['security', 'self-hosted', 'guides', 'compliance']`).
   - Long-tail search phrases belong in `keywords:`.
5. **No Duplicate H1/H2 Title or TL;DR in Markdown Body:**
   - Do not repeat `# Title` or `## TLDR` in the Markdown body — `PostLayout.astro` handles them automatically.
6. **FAQ Accordions:**
   - Format FAQs using `<details class="faq-item"><summary>Question text?</summary>\n\nAnswer text.\n</details>`.
7. **Git Hygiene (No `.txt` files):**
   - Only commit the formatted `.md` file in `src/content/blog/`. Never track or commit draft `.txt` files.
8. **Build Verification:**
   - Run `npm run build` to confirm 0 errors before committing.
9. **Always Ask Before Pushing:**
   - Never push directly to Git without asking for and receiving explicit user confirmation.

## Tips

- Keep the filename lowercase-with-dashes — it's the permanent URL, so don't rename it later.
- Quote the `title`, `description`, and `tldr` values, especially if they contain a `:` or an apostrophe.
- Set `draft: true` while you're still writing; remove it (or set `false`) to publish.
- After you commit, watch the **Actions** tab — a green check means it deployed. A red X means a typo broke
  the build (usually the frontmatter); fix it and commit again. The live site keeps the last good version
  until the build passes, so a mistake never takes the blog down.
- Questions, or need something outside `src/content/blog/`? Ping NH Ops.
