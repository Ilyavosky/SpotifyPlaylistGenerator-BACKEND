import axios from 'axios';
import { db } from '../../lib/db/client';
import { AppError } from '../../lib/errors/AppError';
import { RecommendationParams, SpotifyRecommendationsResponse, SpotifyTrack, SavedTrack } from './recommendations.types';

const SPOTIFY_RECOMMENDATIONS_URL = 'https://api.spotify.com/v1/recommendations';

export async function fetchRecommendations(
  accessToken: string,
  params: RecommendationParams
): Promise<SpotifyTrack[]> {
  try {
    const { data } = await axios.get<SpotifyRecommendationsResponse>(SPOTIFY_RECOMMENDATIONS_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        target_valence: params.target_valence,
        target_energy: params.target_energy,
        target_danceability: params.target_danceability,
        seed_genres: params.seed_genres.join(','),
        limit: 20,
      },
    });
    return data.tracks;
  } catch {
    throw new AppError('SPOTIFY_RECOMMENDATIONS_ERROR', 'Error al obtener recomendaciones de Spotify', 502);
  }
}

export async function saveTracksToSession(
  tracks: SpotifyTrack[],
  sessionId: number,
  params: Pick<RecommendationParams, 'target_valence' | 'target_energy' | 'target_danceability'>
): Promise<SavedTrack[]> {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const saved: SavedTrack[] = [];

    for (const track of tracks) {
      const album = track.album;

      await client.query(
        `INSERT INTO albums (spotify_id, name, release_date, cover_url)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (spotify_id) DO NOTHING`,
        [album.id, album.name, album.release_date, album.images[0]?.url ?? null]
      );

      const albumRow = await client.query(
        'SELECT id FROM albums WHERE spotify_id = $1',
        [album.id]
      );

      const trackRow = await client.query(
        `INSERT INTO tracks (spotify_id, name, duration_ms, uri, album_id, valence, energy, danceability)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (spotify_id) DO NOTHING
         RETURNING id`,
        [
          track.id, track.name, track.duration_ms, track.uri,
          albumRow.rows[0].id,
          params.target_valence, params.target_energy, params.target_danceability,
        ]
      );

      let trackId: number;
      if (trackRow.rows.length > 0) {
        trackId = trackRow.rows[0].id;
      } else {
        const existing = await client.query('SELECT id FROM tracks WHERE spotify_id = $1', [track.id]);
        trackId = existing.rows[0].id;
      }

      for (const artist of track.artists) {
        await client.query(
          `INSERT INTO artists (spotify_id, name)
           VALUES ($1, $2)
           ON CONFLICT (spotify_id) DO NOTHING`,
          [artist.id, artist.name]
        );

        const artistRow = await client.query(
          'SELECT id FROM artists WHERE spotify_id = $1',
          [artist.id]
        );

        await client.query(
          `INSERT INTO track_artists (track_id, artist_id, is_main_artist)
           VALUES ($1, $2, $3)
           ON CONFLICT DO NOTHING`,
          [trackId, artistRow.rows[0].id, track.artists.indexOf(artist) === 0]
        );
      }

      await client.query(
        `INSERT INTO session_tracks (session_id, track_id, status)
         VALUES ($1, $2, 'pending')
         ON CONFLICT (session_id, track_id) DO NOTHING`,
        [sessionId, trackId]
      );

      saved.push({
        id: trackId,
        spotify_id: track.id,
        name: track.name,
        uri: track.uri,
        duration_ms: track.duration_ms,
        valence: params.target_valence,
        energy: params.target_energy,
        danceability: params.target_danceability,
      });
    }

    await client.query('COMMIT');
    return saved;
  } catch {
    await client.query('ROLLBACK');
    throw new AppError('DB_TRACKS_ERROR', 'Error al guardar tracks en la base de datos', 500);
  } finally {
    client.release();
  }
}