import { Request, Response } from '@packages/framework';
import { StatusCodes } from 'http-status-codes';
import { REFRESH_COOKIE_NAME } from '../../config/jwt';
import { AppError } from '@packages/framework';
import { UserModel } from '@models/user';
import { ErrorKeys } from '@data/types';
import { cookieService } from '@services/cookie';
import { validatePassword, passwordErrorKeys } from '@packages/validation/password';
import { UserDB } from '@models/user/types';
import { tokenService } from './tokenService';

export const authService = {
  login: async (email: string, password: string): Promise<UserDB> => {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new AppError({
        code: StatusCodes.UNAUTHORIZED,
        messageKey: ErrorKeys.INVALID_CREDENTIALS,
        message: 'Invalid credentials'
      });
    }
    
    const isValid = await UserModel.validatePassword(user, password);
    if (!isValid) {
      throw new AppError({
        code: StatusCodes.UNAUTHORIZED,
        messageKey: ErrorKeys.INVALID_CREDENTIALS,
        message: 'Invalid credentials'
      });
    }
    
    if (!user.isEmailVerified) {
      throw new AppError({
        code: StatusCodes.FORBIDDEN,
        messageKey: ErrorKeys.USER_EMAIL_NOT_VERIFIED,
        message: 'Email not verified'
      });
    }
    
    return user;
  },

  validatePasswordStrength: (password: string): void => {
    const validation = validatePassword(password);
    
    if (!validation.isValid) {
      const failedCheck = validation.failedChecks[0];
      const messageKey = passwordErrorKeys[failedCheck as keyof typeof passwordErrorKeys] || ErrorKeys.INVALID_PASSWORD;
      
      throw new AppError({
        code: StatusCodes.BAD_REQUEST,
        messageKey,
        message: `Password validation failed: ${failedCheck}`,
        data: { failedChecks: validation.failedChecks }
      });
    }
  },

  authenticate: async (userId: string, email: string, req: Request): Promise<{ accessToken: string, refreshToken: string }> => {
    return await  tokenService.generateTokenPair(userId, email, req);
  },
  
  logout: async (req: Request): Promise<boolean> => {
    const cookies = cookieService.parseCookies(req.headers.cookie);
    const refreshToken = cookies[REFRESH_COOKIE_NAME];
    
    if (refreshToken) {
      return await tokenService.invalidateRefreshToken(refreshToken);
    }
    
    return true;
  },
  
  refreshToken: async (req: Request, res: Response): Promise<{ accessToken: string } | null> => {
    const cookies = cookieService.parseCookies(req.headers.cookie);
    const refreshToken = cookies[REFRESH_COOKIE_NAME];
    
    if (!refreshToken) {
      cookieService.clearRefreshTokenCookie(res);
      return null;
    }
    
    const tokens = await tokenService.refreshTokens(refreshToken, req);
    
    if (!tokens) {
      cookieService.clearRefreshTokenCookie(res);
      return null;
    }
    
    cookieService.setRefreshTokenCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }
}; 