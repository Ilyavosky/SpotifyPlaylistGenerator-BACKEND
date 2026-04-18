import { z } from "zod";

export const idSchema = z.coerce
  .number({ error: 'El id debe ser un número' })
  .int('El ID no puede tener decimales')
  .positive('El ID debe ser mayor a 0')
  .min(1, 'El ID es requerido');

export const spotifyIdSchema = z.string()
  .min(1, 'El Spotify id es requerido')
  .max(100, 'El Spotify id no puede exceder los 100 caracteres');

export const genresSchema = z.object({
  id: idSchema,
  slug: z.string().min(1, 'El slug es requerido').max(100, 'El slug no puede exceder los 100 caracteres'),
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre no puede exceder los 100 caracteres'),
});

export const generationSessionsSchema = z.object({
  id: idSchema,
  session_uuid: z.string().uuid(),
  name: z.string().min(1, 'El nombre es requerido').max(255, 'El nombre no debe exceder los 255 caracteres'),
  target_valence: z.number().nonnegative(),
  target_energy: z.number().nonnegative(),
  target_danceability: z.number().nonnegative(),
  is_exported: z.boolean().default(false),
  created_at: z.coerce.date().default(() => new Date()),
  updated_at: z.coerce.date().default(() => new Date()),
});

export const sessionSeedGenresSchema = z.object({
  session_id: idSchema,
  genre_id: idSchema,
});

export const artistSchema = z.object({
  id: idSchema,
  spotify_id: spotifyIdSchema,
  name: z.string().min(1, 'El nombre del artista es requerido').max(255, 'El nombre del artista no debe exceder los 255 caracteres'),
  image_url: z.string().url('La URL de la imagen debe ser válida').optional(),
});

export const albumsSchema = z.object({
  id: idSchema,
  spotify_id: spotifyIdSchema,
  name: z.string().min(1, 'El nombre del álbum es requerido').max(255, 'El nombre del álbum no debe exceder los 255 caracteres'),
  release_date: z.coerce.date().optional(),
  cover_url: z.string().url('La URL de la imagen debe ser válida').optional(),
});

export const tracksSchema = z.object({
  id: idSchema,
  spotify_id: spotifyIdSchema,
  name: z.string().min(1, 'El nombre del track es requerido').max(255, 'El nombre del track no debe exceder los 255 caracteres'),
  duration_ms: z.number().nonnegative('La duración debe ser mayor a 0 ms').optional(),
  uri: z.string().min(1, 'El URI del track es requerido'),
  album_id: idSchema.optional(),
  valence: z.number().nonnegative().optional(),
  energy: z.number().nonnegative().optional(),
  danceability: z.number().nonnegative().optional(),
});

export const trackArtistsSchema = z.object({
  track_id: idSchema,
  artist_id: idSchema,
  is_main_artist: z.boolean().default(false),
});

export const sessionTrackSchema = z.object({
  id: idSchema,
  session_id: idSchema,
  track_id: idSchema,
  status: z.enum(['pending', 'accepted', 'rejected']).default('pending'),
  added_at: z.coerce.date().default(() => new Date()),
  updated_at: z.coerce.date().default(() => new Date()),
});