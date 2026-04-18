import { db } from '../../lib/db/client';
import { AppError } from '../../lib/errors/AppError';
import { FavoriteWithDetails } from './favorites.types';

export async function updateTrackStatus(
  sessionId: number,
  trackId: number,
  status: 'accepted' | 'rejected'
): Promise<void> {
  try {
    const result = await db.query(
      `UPDATE session_tracks SET status = $1, updated_at = NOW()
       WHERE session_id = $2 AND track_id = $3`,
      [status, sessionId, trackId]
    );

    if (result.rowCount === 0) {
      throw new AppError('TRACK_NOT_FOUND', 'Track no encontrado en la sesión', 404, { sessionId, trackId });
    }
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError('DB_FAVORITES_ERROR', 'Error al actualizar el estado del track', 500);
  }
}

export async function getAcceptedTracks(sessionId: number): Promise<FavoriteWithDetails[]> {
  try {
    const result = await db.query(
      `SELECT
         st.id,
         st.session_id,
         st.track_id,
         st.status,
         t.name AS track_name,
         t.uri AS track_uri,
         t.duration_ms,
         a.name AS artist_name,
         al.name AS album_name,
         al.cover_url
       FROM session_tracks st
       JOIN tracks t ON st.track_id = t.id
       LEFT JOIN track_artists ta ON t.id = ta.track_id AND ta.is_main_artist = true
       LEFT JOIN artists a ON ta.artist_id = a.id
       LEFT JOIN albums al ON t.album_id = al.id
       WHERE st.session_id = $1 AND st.status = 'accepted'
       ORDER BY st.added_at ASC`,
      [sessionId]
    );
    return result.rows as FavoriteWithDetails[];
  } catch {
    throw new AppError('DB_FAVORITES_ERROR', 'Error al obtener favoritos', 500);
  }
}