import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../errors/AppError';

export const sendErrorResponse = (
  res: Response, 
  error: Error | AppError | string,
  statusCode?: StatusCodes
): void => {
  if (error instanceof AppError) {
    res.status(error.code).json({
      error: {
        message: error.message,
        messageKey: error.messageKey,
        data: error.data
      }
    });
    return;
  }

  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorCode = statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  
  res.status(errorCode).json({ 
    error: {
      message: errorMessage
    }
  });
}; 