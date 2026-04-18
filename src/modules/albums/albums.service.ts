import { db } from '../../lib/db/client';
import { AppError } from '../../lib/errors/AppError';
import { Album } from './albums.types';

export async function getAlbums(page: number, limit: number): Promise<{ data: Album[]; meta: { page: number; limit: number; total: number } }> {
  try {
    const offset = (page - 1) * limit;

    const countResult = await db.query('SELECT COUNT(*) FROM albums');
    const total = parseInt(countResult.rows[0].count, 10);

    const result = await db.query(
      'SELECT * FROM albums ORDER BY name ASC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    return {
      data: result.rows as Album[],
      meta: { page, limit, total },
    };
  } catch {
    throw new AppError('DB_ALBUMS_ERROR', 'Error al obtener álbumes', 500);
  }
}