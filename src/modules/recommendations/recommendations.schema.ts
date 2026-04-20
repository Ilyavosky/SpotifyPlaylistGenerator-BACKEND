import { z } from 'zod';

export const recommendationsBodySchema = z.object({
  target_valence: z.number().min(0).max(1),
  target_energy: z.number().min(0).max(1),
  target_danceability: z.number().min(0).max(1),
  seed_genres: z.array(z.string().min(1)).min(1).max(5),
  session_id: z.number().int().positive(),
});