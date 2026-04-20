import { db } from '../../lib/db/client';
import { AppError } from '../../lib/errors/AppError';
import { Session, CreateSessionInput } from './sessions.types';

export async function createSession(input: CreateSessionInput): Promise<Session> {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const sessionResult = await client.query<Session>(
      `INSERT INTO generation_sessions (name, target_valence, target_energy, target_danceability)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [input.name, input.target_valence, input.target_energy, input.target_danceability]
    );

    const session = sessionResult.rows[0];

    for (const slug of input.seed_genres) {
      const genreResult = await client.query(
        'SELECT id FROM genres WHERE slug = $1',
        [slug]
      );

      if (genreResult.rows.length > 0) {
        await client.query(
          `INSERT INTO session_seed_genres (session_id, genre_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [session.id, genreResult.rows[0].id]
        );
      }
    }

    await client.query('COMMIT');
    return session;
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Session error:', err);
    throw new AppError('DB_SESSION_ERROR', 'Error al crear la sesión', 500);
  } finally {
    client.release();
  }
}

export async function getSessions(): Promise<Session[]> {
  try {
    const result = await db.query(
      'SELECT * FROM generation_sessions ORDER BY created_at DESC'
    );
    return result.rows as Session[];
  } catch (err) {
    console.error('getSessions error:', err);
    throw new AppError('DB_SESSION_ERROR', 'Error al obtener sesiones', 500);
  }
}

export async function getSessionById(id: number): Promise<Session> {
  try {
    const result = await db.query(
      'SELECT * FROM generation_sessions WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      throw new AppError('SESSION_NOT_FOUND', 'Sesión no encontrada', 404, { id });
    }

    return result.rows[0] as Session;
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('getSessionById error:', err);
    throw new AppError('DB_SESSION_ERROR', 'Error al obtener la sesión', 500);
  }
}

export async function markSessionAsExported(id: number): Promise<Session> {
  try {
    const result = await db.query(
      `UPDATE generation_sessions SET is_exported = true, updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      throw new AppError('SESSION_NOT_FOUND', 'Sesión no encontrada', 404, { id });
    }

    return result.rows[0] as Session;
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('markSessionAsExported error:', err);
    throw new AppError('DB_SESSION_ERROR', 'Error al actualizar la sesión', 500);
  }
}