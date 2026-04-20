import { Router } from 'express';
import * as favoritesController from '../modules/favorites/favorites.controller';

const router = Router();

router.get('/', favoritesController.getAcceptedTracks);
router.patch('/status', favoritesController.updateTrackStatus);

export default router;