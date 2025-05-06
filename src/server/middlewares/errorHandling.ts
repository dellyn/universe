import { Request, Response, NextFunction, handleError } from '@packages/framework';

export function errorHandlerMiddleware(err: Error, req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) {
    return next(err);
  }
  
  handleError(err, res, 'Unhandled error');
} 