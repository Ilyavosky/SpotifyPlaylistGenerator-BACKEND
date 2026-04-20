import { Request, Response, NextFunction } from 'express';
import * as recommendationsService from './recommendations.service';
import { recommendationsBodySchema } from './recommendations.schema';
import { AppError } from '../../lib/errors/AppError';

export async function getRecommendations(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const accessToken = req.cookies?.access_token;

    if (!accessToken) {
      throw new AppError('UNAUTHORIZED', 'No access token', 401);
    }

    const parsed = recommendationsBodySchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError('VALIDATION_ERROR', 'Parámetros inválidos', 422, { errors: parsed.error.flatten() });
    }

    const { target_valence, target_energy, target_danceability, seed_genres, session_id } = parsed.data;

    const tracks = await recommendationsService.fetchRecommendations(accessToken, {
      target_valence,
      target_energy,
      target_danceability,
      seed_genres,
    });

    const saved = await recommendationsService.saveTracksToSession(tracks, session_id, {
      target_valence,
      target_energy,
      target_danceability,
    });

    res.json({ tracks: saved });
  } catch (err) {
    next(err);
  }
}