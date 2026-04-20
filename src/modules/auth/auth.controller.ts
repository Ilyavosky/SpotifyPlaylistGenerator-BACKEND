import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { callbackQuerySchema } from './auth.schema';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const,
  maxAge: 60 * 60 * 1000,
};

export async function login(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { url, state } = authService.generateAuthUrl();
    res.cookie('spotify_state', state, COOKIE_OPTIONS);
    res.redirect(url);
  } catch (err) {
    next(err);
  }
}

export async function callback(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = callbackQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      res.redirect(`${process.env.FRONTEND_URL}/error?code=INVALID_CALLBACK`);
      return;
    }

    const { code, state } = parsed.data;
    const storedState = req.cookies?.spotify_state;

    if (!storedState || storedState !== state) {
      res.redirect(`${process.env.FRONTEND_URL}/error?code=STATE_MISMATCH`);
      return;
    }

    const tokens = await authService.exchangeCode(code);

    res.clearCookie('spotify_state');
    res.cookie('access_token', tokens.access_token, COOKIE_OPTIONS);
    res.cookie('refresh_token', tokens.refresh_token, {
      ...COOKIE_OPTIONS,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      res.status(401).json({ code: 'UNAUTHORIZED', message: 'No refresh token', details: {} });
      return;
    }

    const tokens = await authService.refreshAccessToken(refreshToken);

    res.cookie('access_token', tokens.access_token, COOKIE_OPTIONS);
    res.json({ expires_in: tokens.expires_in });
  } catch (err) {
    next(err);
  }
}

export async function logout(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.json({ code: 'SUCCESS', message: 'Sesión cerrada', details: {} });
  } catch (err) {
    next(err);
  }
}

export function me(req: Request, res: Response): void {
  const token = req.cookies?.access_token;
  if (!token) {
    res.status(401).json({ code: 'UNAUTHORIZED', message: 'No token', details: {} });
    return;
  }
  res.json({ access_token: token });
}