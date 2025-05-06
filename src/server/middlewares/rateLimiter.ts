import expressLimiter from 'express-rate-limit';
import { Request, Response, NextFunction } from '@packages/framework';

const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;
const ONE_MINUTE_IN_MS = 60 * 1000;

const apiRateLimiter = expressLimiter({
  windowMs: FIVE_MINUTES_IN_MS,
  max: 200,
  message: { error: 'Too many requests from this IP, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const repositoryUpdateLimiter = expressLimiter({
  windowMs: ONE_MINUTE_IN_MS,
  max: 2,
  message: { error: 'Too many repository update requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => `${req.ip}-${req.params.id}`,
});

export function applyRateLimiting(req: Request, res: Response, next: NextFunction): void {
  if (req.url.startsWith('/api')) {
    return apiRateLimiter(req, res, next);
  }
  return next();
}
