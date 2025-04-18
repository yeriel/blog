// src/content.config.ts
import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    published: z.coerce.date(),
    description: z.string().optional(),
    image: z.string().optional(),  
    tags: z.array(z.string()).optional(),
    category: z.string().optional(), 
    draft: z.boolean().default(false)
  }),
});

const specCollection = defineCollection({
  schema: z.object({}).optional() 
});

export const collections = {
  posts: postsCollection,
  spec: specCollection 
};
