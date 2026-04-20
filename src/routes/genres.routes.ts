import { Router } from 'express';
import * as genresController from '../modules/genres/genres.controller';

const router = Router();

router.get('/', genresController.getGenres);

export default router;