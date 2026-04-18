import { z } from 'zod';
import { idSchema } from '../../lib/validations/schema';

export const updateTrackStatusSchema = z.object({
  session_id: idSchema,
  track_id: idSchema,
  status: z.enum(['accepted', 'rejected']),
});

export const getSessionFavoritesSchema = z.object({
  session_id: idSchema,
});