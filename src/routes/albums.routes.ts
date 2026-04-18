import { Router } from 'express';
import * as albumsController from '../modules/albums/albums.controller';

const router = Router();

router.get('/', albumsController.getAlbums);

export default router;