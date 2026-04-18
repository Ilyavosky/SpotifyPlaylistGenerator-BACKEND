import { Router } from 'express';
import authRoutes from './auth.routes';
import genresRoutes from './genres.routes';
import recommendationsRoutes from './recommendations.routes';
import sessionsRoutes from './sessions.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/genres', genresRoutes);
router.use('/recommendations', recommendationsRoutes);
router.use('/sessions', sessionsRoutes);

export default router;