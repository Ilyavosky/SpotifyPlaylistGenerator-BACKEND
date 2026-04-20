import { z } from 'zod';
import { idSchema } from '../../lib/validations/schema';

export const createPlaylistSchema = z.object({
  session_id: idSchema,
  name: z.string().min(1, 'El nombre es requerido').max(255, 'El nombre no debe exceder 255 caracteres'),
});