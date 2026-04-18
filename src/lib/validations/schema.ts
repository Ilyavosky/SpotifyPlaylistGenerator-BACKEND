import { z } from "zod";

//Coerce: Funcionalidad que convierte automáticamente los datos de entrada a un tipo específico antes de validar el esquema

export const idSchema = z.coerce
  .number({ error : 'El id debe ser un número'})
  .int('El ID no puede tener decimales')
  .positive('El ID debe ser mayor a 0')
  .min(1, 'El ID es requerido');

export const spotifyIdSchema = z.string()
    .min(1, 'El Spotify_artist id es requerido')
    .max(100, 'El Spotify_artist id no puede exceder los 100 caracteres');

export const genresSchema = z.object({
  slug: z.string().min(1, 'El slug es requerido').max(100, 'El slug no puede exceder los 100 caracteres'),
  id: idSchema,
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre no puede exceder los 100 caracteres')
});

export const generationSessionsSchema = z.object({
    id : idSchema,
    session_uuid: z.string().uuid(),
    name : z.string().min(1, 'El nombre es requerido')
    .max(255, 'El nombre no debe exceder los 255 caracteres'),
    target_valence: z.number().nonnegative(),
    target_energy: z.number().nonnegative(),
    target_danceability: z.number().nonnegative(),
    is_exporte: z.boolean().default(false),
    created_at: z.coerce.date().default(() => new Date()),
    updated_at: z.coerce.date().default(() => new Date())
});

export const sessionSeedGenresSchema = z.object({
    session_id: idSchema,
    genre_id: idSchema  
});

export const artistSchema = z.object({
    id: idSchema,
    spotify_id: spotifyIdSchema,
    name: z.string().min(100, 'El nombre del artista es neceario')
    .max(255, 'El nombre del artista no debe excedere los 255 caracteres'),
    img_url: z.string().url('La URL de la imagen debe ser valida')
});

export const albumsSchema = z.object({
    id: idSchema,
    spotify_id: spotifyIdSchema,
    name: z.string().min(100, 'El nombre del artista es neceario')
    .max(255, 'El nombre del album no debe excedere los 255 caracteres'),
    release_date: z.coerce.date().default(() => new Date()),
    cover_url: z.string().url('La URL de la imagen debe ser valida') 
});

export const tracksSchema = z.object({
    id : idSchema,
    spotifyId: spotifyIdSchema,
    name: z.string().min(100, 'El nombre del artista es neceario')
    .max(255, 'El nombre de las canciones no debe excedere los 255 caracteres'),
    duration_ms: z.number().nonnegative('La duracion debe ser mayor a 0 ms'),
    url: z.string().url('La URL del track debe ser valida'),
    album_id: idSchema,
    valence: z.number().nonnegative(),
    energy: z.number().nonnegative(),
    danceability: z.number().nonnegative(),
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
    track_status: z.enum(['pending', 'accepted', 'rejected'])
    .default('pending'),
    added_at: z.coerce.date().default(() => new Date()),
    updated_at: z.coerce.date().default(() => new Date())
});