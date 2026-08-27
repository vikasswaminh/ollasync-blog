// ─────────────────────────────────────────────────────────────────────────────
//  PER-PROJECT BRANDING  ·  the ONLY file that changes between blog repos.
//  Owner-locked via CODEOWNERS — the SEO team does not edit this (see CONTRIBUTING.md).
// ─────────────────────────────────────────────────────────────────────────────
export const SITE = {
  brand: 'OllaSync',
  title: 'OllaSync Blog',
  description: 'Guides, tips, and product updates from the OllaSync team.',
  url: 'https://blogs.ollasync.com',
  marketingUrl: 'https://ollasync.com',
  marketingLabel: 'ollasync.com',
  author: 'OllaSync Team',
  accent: '#06b6d4',
  tagline: 'Your files, everywhere.',
  locale: 'en',
} as const;

export const NAV = [
  { label: 'Blog', href: '/' },
  { label: 'Tags', href: '/tags/' },
  { label: 'About', href: '/about/' },
];
