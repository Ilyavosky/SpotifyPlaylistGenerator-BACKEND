import { Request, Response, NextFunction } from 'express';
import { refreshAccessToken } from '../modules/auth/auth.service';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 1000,
};

export async function authRefresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (req.cookies?.access_token) {
    next();
    return;
  }

  const refreshToken = req.cookies?.refresh_token;
  if (!refreshToken) {
    next();
    return;
  }

  try {
    const tokens = await refreshAccessToken(refreshToken);
    res.cookie('access_token', tokens.access_token, COOKIE_OPTIONS);
    req.cookies.access_token = tokens.access_token;
    next();
  } catch {
    next();
  }
}