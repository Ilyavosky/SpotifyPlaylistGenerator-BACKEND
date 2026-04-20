import { z } from 'zod';

export const genreSlugSchema = z.object({
  slug: z.string().min(1, 'El slug es requerido').max(100, 'El slug no puede exceder 100 caracteres'),
});