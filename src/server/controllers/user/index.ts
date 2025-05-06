import { Response, Request, AppError, handleError } from '@packages/framework';
import { StatusCodes } from 'http-status-codes';
import { userService, sanitizeUser } from '@services/user';
import { authService } from '@services/auth';
import { cookieService } from '@services/cookie';
import { ErrorKeys } from '@data/types';
import { AuthenticatedRequest } from '@services/auth/types';

export const userController = {
  register: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body || {};
      
      if (!email || !password) {
        throw new AppError({
          code: StatusCodes.BAD_REQUEST,
          messageKey: ErrorKeys.USER_EMAIL_PASSWORD_REQUIRED,
          message: 'Email and password are required'
        });
      }
      
      const user = await userService.register(email, password);
      const tokens = await authService.authenticate(user.id, user.email, req);
      
      cookieService.setRefreshTokenCookie(res, tokens.refreshToken);
      
      res.json({
        user: sanitizeUser(user),
        accessToken: tokens.accessToken
      });
    } catch (error) {
      handleError(error, res, 'Registration error');
    }
  },
  
  getProfile: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError({
          code: StatusCodes.UNAUTHORIZED,
          messageKey: ErrorKeys.AUTH_REQUIRED,
          message: 'Authentication required'
        });
      }
      
      const user = await userService.getUser(req.user.id);
      res.json({ user: sanitizeUser(user) });
    } catch (error) {
      handleError(error, res, 'Profile error');
    }
  }
}; 