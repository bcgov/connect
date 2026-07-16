import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**',
      schema: z.object({
        pathwayTitle: z.string().optional(),
        pathwayDescription: z.string().optional(),
        pathways: z.array(z.object({
          title: z.string(),
          description: z.string(),
          icon: z.string(),
          to: z.string()
        })).optional()
      })
    }),
  },
})
