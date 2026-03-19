import { defineConfig, defineCollections } from 'fumadocs-mdx/config';
import { z } from 'zod';

export const blog = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string().date(),
    author: z.string(),
    category: z.string(),
    image: z.string().optional(),
  }),
});

export const research = defineCollections({
  type: 'doc',
  dir: 'content/research',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string().date(),
    authors: z.array(z.string()),
    type: z.string(),
    abstract: z.string(),
    image: z.string().optional(),
  }),
});

export default defineConfig({});
