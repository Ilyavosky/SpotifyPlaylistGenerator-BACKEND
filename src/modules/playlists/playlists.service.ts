import axios from 'axios';
import { db } from '../../lib/db/client';
import { AppError } from '../../lib/errors/AppError';
import { SpotifyCreatePlaylistResponse } from './playlists.types';

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

async function getSpotifyUserId(accessToken: string): Promise<string> {
  try {
    const { data } = await axios.get(`${SPOTIFY_API_URL}/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return data.id;
  } catch {
    throw new AppError('SPOTIFY_USER_ERROR', 'Error al obtener el usuario de Spotify', 502);
  }
}

async function getAcceptedUris(sessionId: number): Promise<string[]> {
  try {
    const result = await db.query(
      `SELECT t.uri FROM session_tracks st
       JOIN tracks t ON st.track_id = t.id
       WHERE st.session_id = $1 AND st.status = 'accepted'`,
      [sessionId]
    );
    return result.rows.map((r: { uri: string }) => r.uri);
  } catch {
    throw new AppError('DB_PLAYLIST_ERROR', 'Error al obtener tracks aceptados', 500);
  }
}

export async function createAndExportPlaylist(
  accessToken: string,
  sessionId: number,
  name: string
): Promise<SpotifyCreatePlaylistResponse> {
  const uris = await getAcceptedUris(sessionId);

  if (uris.length === 0) {
    throw new AppError('NO_ACCEPTED_TRACKS', 'No hay tracks aceptados en esta sesión', 400, { sessionId });
  }

  const userId = await getSpotifyUserId(accessToken);

  try {
    const { data: playlist } = await axios.post<SpotifyCreatePlaylistResponse>(
      `${SPOTIFY_API_URL}/users/${userId}/playlists`,
      { name, public: false },
      { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
    );

    await axios.post(
      `${SPOTIFY_API_URL}/playlists/${playlist.id}/tracks`,
      { uris },
      { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
    );

    await db.query(
      `UPDATE generation_sessions SET is_exported = true, updated_at = NOW() WHERE id = $1`,
      [sessionId]
    );

    return playlist;
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError('SPOTIFY_PLAYLIST_ERROR', 'Error al crear la playlist en Spotify', 502);
  }
}