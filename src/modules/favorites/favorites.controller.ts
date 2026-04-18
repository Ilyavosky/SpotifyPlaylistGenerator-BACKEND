import { Request, Response, NextFunction } from 'express';
import * as favoritesService from './favorites.service';
import { updateTrackStatusSchema, getSessionFavoritesSchema } from './favorites.schema';
import { AppError } from '../../lib/errors/AppError';

export async function updateTrackStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = updateTrackStatusSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError('VALIDATION_ERROR', 'Parámetros inválidos', 422, { errors: parsed.error.flatten() });
    }

    const { session_id, track_id, status } = parsed.data;
    await favoritesService.updateTrackStatus(session_id, track_id, status);

    res.json({ code: 'SUCCESS', message: 'Estado actualizado', details: {} });
  } catch (err) {
    next(err);
  }
}

export async function getAcceptedTracks(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = getSessionFavoritesSchema.safeParse(req.query);

    if (!parsed.success) {
      throw new AppError('VALIDATION_ERROR', 'Parámetros inválidos', 422, { errors: parsed.error.flatten() });
    }

    const favorites = await favoritesService.getAcceptedTracks(parsed.data.session_id);
    res.json({ favorites });
  } catch (err) {
    next(err);
  }
}