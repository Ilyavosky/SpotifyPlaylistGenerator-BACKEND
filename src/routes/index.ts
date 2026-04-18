import { Router } from 'express';
import authRoutes from './auth.routes';
import genresRoutes from './genres.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/genres', genresRoutes);

export default router;