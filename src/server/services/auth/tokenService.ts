import jwt from 'jsonwebtoken';
import { 
  JWT_ACCESS_SECRET, 
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY
} from '@config/jwt';
import { RefreshTokenModel } from '@models/refreshTokens';
import { UserModel } from '@models/user';

const tokenRefreshLocks = new Map<string, boolean>();

export interface TokenPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
}

export const tokenService = {

  
  generateAccessToken: (userId: string, email: string): string => {
    return jwt.sign(
      { userId, email, type: 'access' } as TokenPayload,
      JWT_ACCESS_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
  },

  generateRefreshToken: (userId: string, email: string): string => {
    return jwt.sign(
      { userId, email, type: 'refresh' } as TokenPayload,
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
  },

  verifyAccessToken: (token: string): TokenPayload | null => {
    try {
      const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as TokenPayload;
      if (decoded.type !== 'access') {
        return null;
      }
      return decoded;
    } catch (error) {
      return null;
    }
  },

  verifyRefreshToken: (token: string): TokenPayload | null => {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
      if (decoded.type !== 'refresh') {
        return null;
      }
      return decoded;
    } catch (error) {
      return null;
    }
  },

  generateTokenPair: async (userId: string, email: string, req?: any): Promise<{ accessToken: string, refreshToken: string }> => {
    const accessToken = tokenService.generateAccessToken(userId, email);
    const refreshToken = tokenService.generateRefreshToken(userId, email);
    
    await RefreshTokenModel.create(userId, email, refreshToken, req);
    
    return { accessToken, refreshToken };
  },

  refreshTokens: async (refreshToken: string, req?: any): Promise<{ accessToken: string, refreshToken: string } | null> => {
    const payload = tokenService.verifyRefreshToken(refreshToken);
    if (!payload || tokenRefreshLocks.get(refreshToken)) return null;

    try {
      tokenRefreshLocks.set(refreshToken, true);

      const tokenDoc = await RefreshTokenModel.findByToken(refreshToken);
      if (!tokenDoc) return null;
      const user = await UserModel.findById(tokenDoc.userId);
      
      if (!user) {
        await RefreshTokenModel.deleteToken(refreshToken);
        return null;
      }

      await RefreshTokenModel.deleteToken(refreshToken);
      
      return await tokenService.generateTokenPair(user.id, user.email, req);
    } finally {
      tokenRefreshLocks.delete(refreshToken);
    }
  },

  invalidateRefreshToken: async (refreshToken: string): Promise<boolean> => {
    const payload = tokenService.verifyRefreshToken(refreshToken);
    if (!payload) {
      return false;
    }

    return await RefreshTokenModel.deleteToken(refreshToken);
  },
}; 