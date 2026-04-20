import { Request, Response, NextFunction } from 'express';
import * as genresService from './genres.service';
import { AppError } from '../../lib/errors/AppError';

export async function getGenres(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cached = await genresService.getGenresFromDb();

    if (cached.length > 0) {
      res.json({ genres: cached.map(g => g.slug) });
      return;
    }

    const accessToken = req.cookies?.access_token;

    if (!accessToken) {
      throw new AppError('UNAUTHORIZED', 'No access token', 401);
    }

    const genres = await genresService.getGenresFromSpotify(accessToken);
    await genresService.syncGenres(genres);

    res.json({ genres });
  } catch (err) {
    next(err);
  }
}