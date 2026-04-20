import { Router } from 'express';
import * as recommendationsController from '../modules/recommendations/recommendations.controller';

const router = Router();

router.post('/', recommendationsController.getRecommendations);

export default router;