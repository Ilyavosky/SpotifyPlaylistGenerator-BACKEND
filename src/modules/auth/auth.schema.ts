import { z } from "zod";

export const callbackQuerySchema = z.object({
  code: z.string().min(1, 'El código de autorización es requerido'),
  state: z.string().min(1, 'El state es requerido'),
});

export const refreshTokenSchema = z.object({
  refresh_token: z.string().min(1, 'El refresh token es requerido'),
});