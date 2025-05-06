import { AppError, Response } from '@packages/framework';
import { StatusCodes } from 'http-status-codes';

export const handleError = (
  error: unknown, 
  res: Response, 
  contextMessage?: string
): void => {

  console.error(`${contextMessage}:`, error);
  if (error instanceof AppError) {
    res.status(error.code).json({
      error: error.message,
      errorKey: error.messageKey,
      data: error.data
    });
    return;
  }
  
  if (error instanceof Error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message,
      errorKey: 'error.internal'
    });
    return;
  }
  
  // Handle unknown errors
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: `${contextMessage}: An unexpected error occurred`,
    errorKey: 'error.internal'
  });
}; 