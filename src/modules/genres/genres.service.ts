import { db } from '../../lib/db/client';
import { AppError } from '../../lib/errors/AppError';
import { Genre } from './genres.types';

export async function getGenresFromSpotify(_accessToken: string): Promise<string[]> {
  return [
    'acoustic', 'afrobeat', 'alt-rock', 'alternative', 'ambient',
    'anime', 'black-metal', 'bluegrass', 'blues', 'bossanova',
    'brazil', 'breakbeat', 'british', 'cantopop', 'chicago-house',
    'children', 'chill', 'classical', 'club', 'comedy',
    'country', 'dance', 'dancehall', 'death-metal', 'deep-house',
    'detroit-techno', 'disco', 'disney', 'drum-and-bass', 'dub',
    'dubstep', 'edm', 'electro', 'electronic', 'emo',
    'folk', 'forro', 'french', 'funk', 'garage',
    'german', 'gospel', 'goth', 'grindcore', 'groove',
    'grunge', 'guitar', 'happy', 'hard-rock', 'hardcore',
    'hardstyle', 'heavy-metal', 'hip-hop', 'holidays', 'honky-tonk',
    'house', 'idm', 'indian', 'indie', 'indie-pop',
    'industrial', 'iranian', 'j-dance', 'j-idol', 'j-pop',
    'j-rock', 'jazz', 'k-pop', 'kids', 'latin',
    'latino', 'malay', 'mandopop', 'metal', 'metal-misc',
    'metalcore', 'minimal-techno', 'movies', 'mpb', 'new-age',
    'new-release', 'opera', 'pagode', 'party', 'philippines-opm',
    'piano', 'pop', 'pop-film', 'post-dubstep', 'power-pop',
    'progressive-house', 'psych-rock', 'punk', 'punk-rock', 'r-n-b',
    'rainy-day', 'reggae', 'reggaeton', 'road-trip', 'rock',
    'rock-n-roll', 'rockabilly', 'romance', 'sad', 'salsa',
    'samba', 'sertanejo', 'show-tunes', 'singer-songwriter', 'ska',
    'sleep', 'songwriter', 'soul', 'soundtracks', 'spanish',
    'study', 'summer', 'swedish', 'synth-pop', 'tango',
    'techno', 'trance', 'trip-hop', 'turkish', 'work-out',
    'world-music',
  ];
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