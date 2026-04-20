import { Router } from 'express';
import authRoutes from './auth.routes';
import genresRoutes from './genres.routes';
import recommendationsRoutes from './recommendations.routes';
import sessionsRoutes from './sessions.routes';
import favoritesRoutes from './favorites.routes';
import playlistsRoutes from './playlists.routes';
import albumsRoutes from './albums.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/genres', genresRoutes);
router.use('/recommendations', recommendationsRoutes);
router.use('/sessions', sessionsRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/playlists', playlistsRoutes);
router.use('/albums', albumsRoutes);

export default router;