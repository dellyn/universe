import { Request, Response, NextFunction, handleError, AppError } from '@packages/framework';
import { StatusCodes } from 'http-status-codes';
import { userService } from '@services/user';
import { ErrorKeys } from '@data/types';
import { AuthenticatedRequest } from '@services/auth/types';

export const requireVerifiedEmailMiddleware = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  const authReq = req as AuthenticatedRequest;
  
  if (!authReq.user || !authReq.user.id) {
    handleError(new AppError({
      code: StatusCodes.UNAUTHORIZED,
      messageKey: ErrorKeys.AUTH_REQUIRED,
      message: 'Authentication required'
    }), res);
    return;
  }
  
  try {
    const user = await userService.getUser(authReq.user.id);
    
    if (!user.isEmailVerified) {
      handleError(new AppError({
        code: StatusCodes.FORBIDDEN,
        messageKey: ErrorKeys.USER_EMAIL_NOT_VERIFIED,
        message: 'Email verification required'
      }), res);
      return;
    }
    
    next();
  } catch (error) {
    console.error('Email verification check error:', error);
    handleError(new AppError({
      code: StatusCodes.UNAUTHORIZED    ,
      messageKey: ErrorKeys.AUTH_REQUIRED,
      message: 'Authentication failed'
    }), res);
  }
}; 