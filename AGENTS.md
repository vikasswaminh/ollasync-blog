# Agent Instructions for Ollasync Blog

Follow these mandatory rules whenever preparing, formatting, or uploading a new blog post:

## 1. Verbatim Content Preservation (CRITICAL)
- The main content from the user's provided `.txt` draft must remain **100% untouched**.
- **DO NOT** summarize, condense, rewrite, or trim sections, paragraphs, or lists to fit an arbitrary word count unless the user explicitly commands it in that exact prompt.

## 2. Exact TL;DR from the Draft File
- Always copy the exact `TLDR` paragraph from the `.txt` draft into the frontmatter `tldr:` field.
- `PostLayout.astro` renders `{tldr || description}` in the top signature TL;DR card.
- Never write a custom or summarized TLDR.

## 3. Checklist Formatting (No Checkboxes)
- Checklists must be formatted as clean, standard bullet points (e.g. `- **Item:** ...`).
- **NEVER** use interactive Markdown checkboxes (`- [ ]`) because they render as HTML tick boxes on the page.

## 4. Frontmatter Structure
- `title`: Headline string (matches draft).
- `description`: 1-2 sentence overview from draft line 5.
- `tldr`: Verbatim TLDR text from draft line 12.
- `pubDate`: Current date in `YYYY-MM-DD` format.
- `category`: Primary category (e.g., `"Security"`).
- `tags`: Short, categorical tags (e.g., `["security", "self-hosted", "guides", "compliance"]`).
- `keywords`: SEO search phrases array.
- `takeaways`: Verbatim bullet points from the draft's Key Takeaways.
- `cover`: Default to `"/blog-cover-server-blind.png"` if not specified.
- `pillar`: `false`.

## 5. Body Formatting
- Do not duplicate the `# Title` or `## TLDR` in the Markdown body (`PostLayout.astro` renders them automatically).
- Format all FAQs using interactive HTML5 details accordions:
  ```html
  <details class="faq-item">
  <summary>Question text?</summary>

  Answer text.
  </details>
  ```
- Related reading links should point to valid internal `/blog/...` paths.

## 6. Git Hygiene
- Raw `.txt` drafts must **never** be committed or tracked in Git (`*.txt` is in `.gitignore`).
- Remove any temporary `.txt` files from `src/content/blog/` before staging changes.

## 7. Build Verification
- Always execute `npm run build` and ensure 0 errors across all static routes.

## 8. Ask Before Pushing (CRITICAL)
- **NEVER** push directly to Git without asking for and receiving explicit confirmation from the user.
