import { z } from 'zod';

export const createSessionSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(255, 'El nombre no debe exceder 255 caracteres'),
  target_valence: z.number().min(0).max(1),
  target_energy: z.number().min(0).max(1),
  target_danceability: z.number().min(0).max(1),
  seed_genres: z.array(z.string().min(1)).min(1).max(5),
});

export const updateSessionStatusSchema = z.object({
  is_exported: z.boolean(),
});