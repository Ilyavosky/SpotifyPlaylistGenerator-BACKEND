import { Request, Response, NextFunction } from 'express';
import * as playlistsService from './playlists.service';
import { createPlaylistSchema } from './playlists.schema';
import { AppError } from '../../lib/errors/AppError';

export async function createPlaylist(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const accessToken = req.cookies?.access_token;

    if (!accessToken) {
      throw new AppError('UNAUTHORIZED', 'No access token', 401);
    }

    const parsed = createPlaylistSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError('VALIDATION_ERROR', 'Parámetros inválidos', 422, { errors: parsed.error.flatten() });
    }

    const playlist = await playlistsService.createAndExportPlaylist(
      accessToken,
      parsed.data.session_id,
      parsed.data.name
    );

    res.status(201).json({
      spotify_playlist_id: playlist.id,
      name: playlist.name,
      spotify_url: playlist.external_urls.spotify,
    });
  } catch (err) {
    next(err);
  }
}