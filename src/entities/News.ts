import { z } from 'zod';
import { ArtistSchema } from './Artist';

export const NewsSchema = z.object({
  id: z.number(),
  originalTitle: z.string(),
  originalContent: z.string(),
  translatedTitle: z.string(),
  translatedContent: z.string(),
  publishedAt: z.string().nullable(), // or z.date()
  sourceUrl: z.string().url(),
  category: z.string(),
  createdAt: z.string(), // or z.date()
  updatedAt: z.string(), // or z.date()
  artist: ArtistSchema.nullable(),
});

export const NewsArraySchema = z.array(NewsSchema);

export type News = z.infer<typeof NewsSchema>;
