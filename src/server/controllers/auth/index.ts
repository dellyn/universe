import { handleError, Response, Request, AppError} from '@packages/framework';
import { ErrorKeys } from '@data/types'
import { StatusCodes } from 'http-status-codes';
import { userService, sanitizeUser } from '@services/user';
import { authService } from '@services/auth';
import { cookieService } from '@services/cookie';
import { tokenService } from '@services/auth/tokenService';
import { AuthenticatedRequest } from '@services/auth/types';

export const authController = {
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
        accessToken: tokens.accessToken,
        needsVerification: true
      });
    } catch (error) {
      handleError(error, res, 'Registration error');
    }
  },
  
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body || {};
      
      if (!email || !password) {
        throw new AppError({
          code: StatusCodes.BAD_REQUEST,
          messageKey: ErrorKeys.USER_EMAIL_PASSWORD_REQUIRED,
          message: 'Email and password are required'
        });
      }
      
      const user = await authService.login(email, password);
      const tokens = await authService.authenticate(user.id, user.email, req);
      
      cookieService.setRefreshTokenCookie(res, tokens.refreshToken);
      
      res.json({
        user: sanitizeUser(user),
        accessToken: tokens.accessToken
      });
    } catch (error) {
      handleError(error, res, 'Login error');
    }
  },
  
  getSession: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
  },
  
  logout: async (req: Request, res: Response): Promise<void> => {
    try {
      await authService.logout(req);
      cookieService.clearRefreshTokenCookie(res);
      res.json({ success: true });
    } catch (error) {
      handleError(error, res, 'Logout error');
    }
  },
  
  refreshToken: async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await authService.refreshToken(req, res);
      
      if (result) {
        // Get user details to return with the response
        const tokenPayload = tokenService.verifyAccessToken(result.accessToken);
        let user = null;
        
        if (tokenPayload?.userId) {
          const userRecord = await userService.findById(tokenPayload.userId);
          if (userRecord) {
            user = sanitizeUser(userRecord);
          }
        }
        
        res.json({ 
          accessToken: result.accessToken,
          user
        });
      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({ 
          message: 'Invalid refresh token' 
        });
      }
    } catch (error) {
      handleError(error, res, 'Token refresh error');
    }
  },
  
  verifyEmailCode: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError({
          code: StatusCodes.UNAUTHORIZED,
          messageKey: ErrorKeys.AUTH_REQUIRED,
          message: 'Authentication required'
        });
      }
      
      const { code } = req.body;
      
      if (!code || typeof code !== 'string') {
        throw new AppError({
          code: StatusCodes.BAD_REQUEST,
          messageKey: ErrorKeys.USER_VERIFICATION_TOKEN_INVALID,
          message: 'Invalid verification code'
        });
      }
      
      const user = await userService.verifyEmailCode(req.user.id, code);
      
      res.json({
        verified: true,
        user: sanitizeUser(user)
      });
    } catch (error) {
      handleError(error, res, 'Email verification error');
    }
  },
  
  resendVerificationEmail: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError({
          code: StatusCodes.UNAUTHORIZED,
          messageKey: ErrorKeys.AUTH_REQUIRED,
          message: 'Authentication required'
        });
      }
      
      const success = await userService.resendVerificationEmail(req.user.id);
      
      if(!success) {
        throw new AppError({
          code: StatusCodes.BAD_REQUEST,
          messageKey: 'email.verification.resend.failed',
          message: 'Failed to send verification email'
        });
      } 
      res.json({
        success
      });
    } catch (error) {
      handleError(error, res, 'Resend verification error');
    }
  }
}; 