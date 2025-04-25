// src/content.config.ts
import { defineCollection, z } from 'astro:content';

const categories = ['Posts', 'Apuntes', 'Proyectos', ] as const;

const postsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    published: z.coerce.date(),
    description: z.string().optional(),
    image: z.string().optional(),  
    tags: z.array(z.string()).optional(),
    category: z.enum(categories).optional(), 
    draft: z.boolean().default(true)
  }),
});

const specCollection = defineCollection({
  schema: z.object({}).optional() 
});

export const collections = {
  posts: postsCollection,
  spec: specCollection 
};
