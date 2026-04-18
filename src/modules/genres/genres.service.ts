import axios from 'axios';
import { db } from '../../lib/db/client';
import { AppError } from '../../lib/errors/AppError';
import { SpotifyGenresResponse, Genre } from './genres.types';

const SPOTIFY_GENRES_URL = 'https://api.spotify.com/v1/recommendations/available-genre-seeds';

export async function getGenresFromSpotify(accessToken: string): Promise<string[]> {
  try {
    const { data } = await axios.get<SpotifyGenresResponse>(SPOTIFY_GENRES_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return data.genres;
  } catch {
    throw new AppError('SPOTIFY_GENRES_ERROR', 'Error al obtener géneros de Spotify', 502);
  }
}

export async function syncGenres(genres: string[]): Promise<void> {
  try {
    for (const slug of genres) {
      await db.query(
        `INSERT INTO genres (slug, name)
         VALUES ($1, $2)
         ON CONFLICT (slug) DO NOTHING`,
        [slug, slug]
      );
    }
  } catch {
    throw new AppError('DB_GENRES_ERROR', 'Error al sincronizar géneros en la base de datos', 500);
  }
}

export async function getGenresFromDb(): Promise<Genre[]> {
  try {
    const result = await db.query('SELECT id, slug, name FROM genres ORDER BY slug ASC');
    return result.rows as Genre[];
  } catch {
    throw new AppError('DB_GENRES_ERROR', 'Error al obtener géneros de la base de datos', 500);
  }
}