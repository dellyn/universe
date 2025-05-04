import { StatusCodes } from 'http-status-codes';
import { Request, Response } from '@interfaces/api';
import { tokenService } from '@services/tokenService';
import { UserModel } from '@models/user';
import { RefreshTokenModel } from '@models/refreshToken';

export const auth = {
  extractTokenFromHeader: (req: Request): string | null => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1];
  },

  generateToken: async (userId: string, email: string, req?: any): Promise<{ accessToken: string, refreshToken: string }> => {
    return await tokenService.generateTokenPair(userId, email, req);
  },

  authenticateRequest: async (
    req: Request, 
    res: Response, 
    next: () => Promise<boolean>
  ): Promise<boolean> => {
    try {
      const token = auth.extractTokenFromHeader(req);
      
      if (!token) {
        res.error('Authentication required', StatusCodes.UNAUTHORIZED);
        return false;
      }
      
      const payload = tokenService.verifyAccessToken(token);
      if (!payload) {
        res.error('Invalid or expired token', StatusCodes.UNAUTHORIZED);
        return false;
      }
      
      // Get user from database
      const user = await UserModel.findById(payload.userId);
      if (!user) {
        res.error('User not found', StatusCodes.UNAUTHORIZED);
        return false;
      }
      
      // Attach user to request
      req.user = {
        id: user.id,
        email: user.email
      };
      
      return next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.error('Authentication failed', StatusCodes.UNAUTHORIZED);
      return false;
    }
  },
  
  refreshTokens: async (refreshToken: string, req?: any): Promise<{ accessToken: string, refreshToken: string } | null> => {
    return await tokenService.refreshTokens(refreshToken, req);
  },
  
  revokeToken: async (refreshToken: string): Promise<boolean> => {
    return await tokenService.invalidateRefreshToken(refreshToken);
  },
  
  revokeAllTokens: async (userId: string): Promise<boolean> => {
    return await tokenService.invalidateAllRefreshTokens(userId);
  },
  
  // Get all active sessions for a user
  getUserSessions: async (userId: string): Promise<any[]> => {
    return await tokenService.getUserSessions(userId);
  },
  
  // Revoke a specific session by its ID
  revokeSession: async (userId: string, sessionId: string): Promise<boolean> => {
    const session = await RefreshTokenModel.findByToken(sessionId);
    if (!session || session.userId !== userId) {
      return false;
    }
    return await RefreshTokenModel.deleteToken(sessionId);
  }
}; 