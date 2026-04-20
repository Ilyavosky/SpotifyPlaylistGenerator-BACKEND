import { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/errors/AppError';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      details: err.details,
    });
    return;
  }

  console.error('Unhandled error:', err);

  res.status(500).json({
    code: 'INTERNAL_ERROR',
    message: 'Unexpected error',
    details: {},
  });
}