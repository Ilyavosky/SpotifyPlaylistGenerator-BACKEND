import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import * as authController from '../modules/auth/auth.controller';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: { code: 'TOO_MANY_REQUESTS', message: 'Demasiados intentos. Intenta de nuevo en 15 minutos.', details: {} },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/me', (req, res) => {
  const token = req.cookies?.access_token;
  if (!token) {
    res.status(401).json({ code: 'UNAUTHORIZED', message: 'No token', details: {} });
    return;
  }
  res.json({ access_token: token });
});

router.get('/login', authLimiter, authController.login);
router.get('/callback', authController.callback);
router.post('/refresh', authLimiter, authController.refresh);
router.post('/logout', authController.logout);

export default router;