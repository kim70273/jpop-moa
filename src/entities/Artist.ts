import { z } from 'zod';

export const ArtistSchema = z.object({
  id: z.number(),
  name: z.string(),
  koreanName: z.string().nullable(),
  createdAt: z.string(), // or z.date() if you parse it
  updatedAt: z.string(), // or z.date()
});

export type Artist = z.infer<typeof ArtistSchema>;
