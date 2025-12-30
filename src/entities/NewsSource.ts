import { z } from 'zod';
import { ArtistSchema } from './Artist';

export const NewsSourceSchema = z.object({
  id: z.number(),
  url: z.string().url(),
  description: z.string().nullable(),
  lastCrawledAt: z.string().nullable(), // or z.date()
  artist: ArtistSchema.nullable(), // NewsSource can be associated with an artist
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const NewsSourceArraySchema = z.array(NewsSourceSchema);

export type NewsSource = z.infer<typeof NewsSourceSchema>;
