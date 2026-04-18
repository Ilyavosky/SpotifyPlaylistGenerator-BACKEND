import { Request, Response, NextFunction } from 'express';
import * as sessionsService from './sessions.service';
import { createSessionSchema, updateSessionStatusSchema } from './sessions.schema';
import { AppError } from '../../lib/errors/AppError';
import { idSchema } from '../../lib/validations/schema';

export async function createSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = createSessionSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError('VALIDATION_ERROR', 'Parámetros inválidos', 422, { errors: parsed.error.flatten() });
    }

    const session = await sessionsService.createSession(parsed.data);
    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
}

export async function getSessions(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const sessions = await sessionsService.getSessions();
    res.json(sessions);
  } catch (err) {
    next(err);
  }
}

export async function getSessionById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = idSchema.safeParse(req.params.id);

    if (!parsed.success) {
      throw new AppError('VALIDATION_ERROR', 'ID inválido', 400, { errors: parsed.error.flatten() });
    }

    const session = await sessionsService.getSessionById(parsed.data);
    res.json(session);
  } catch (err) {
    next(err);
  }
}

export async function markSessionAsExported(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedId = idSchema.safeParse(req.params.id);

    if (!parsedId.success) {
      throw new AppError('VALIDATION_ERROR', 'ID inválido', 400, { errors: parsedId.error.flatten() });
    }

    const parsed = updateSessionStatusSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError('VALIDATION_ERROR', 'Parámetros inválidos', 422, { errors: parsed.error.flatten() });
    }

    const session = await sessionsService.markSessionAsExported(parsedId.data);
    res.json(session);
  } catch (err) {
    next(err);
  }
}