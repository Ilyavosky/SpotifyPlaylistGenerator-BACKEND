import { Router } from 'express';
import * as playlistsController from '../modules/playlists/playlists.controller';

const router = Router();

router.post('/', playlistsController.createPlaylist);

export default router;