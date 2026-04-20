import { Router } from 'express';
import * as sessionsController from '../modules/sessions/sessions.controller';

const router = Router();

router.get('/', sessionsController.getSessions);
router.get('/:id', sessionsController.getSessionById);
router.post('/', sessionsController.createSession);
router.patch('/:id/export', sessionsController.markSessionAsExported);

export default router;