import { Request, Response, NextFunction } from 'express';
import * as genresService from './genres.service';

export async function getGenres(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const genres = await genresService.getGenresFromSpotify('');
    res.json({ genres });
  } catch (err) {
    next(err);
  }
}