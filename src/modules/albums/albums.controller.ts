import { Request, Response, NextFunction } from 'express';
import * as albumsService from './albums.service';
import { getAlbumsQuerySchema } from './albums.schema';
import { AppError } from '../../lib/errors/AppError';

export async function getAlbums(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = getAlbumsQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      throw new AppError('VALIDATION_ERROR', 'Parámetros inválidos', 422, { errors: parsed.error.flatten() });
    }

    const result = await albumsService.getAlbums(parsed.data.page, parsed.data.limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
}