import { defineCollection, z } from 'astro:content';

// The blog collection. Each post is a markdown file in src/content/blog/*.md
// with the frontmatter below. See CONTRIBUTING.md for the authoring guide.
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().optional(),
    authorRole: z.string().optional(),
    category: z.string().optional(),
    readTime: z.union([z.number(), z.string()]).optional(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    pillar: z.boolean().default(false),
    pillarSlug: z.string().optional(),
    keywords: z.array(z.string()).default([]),
    takeaways: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };

