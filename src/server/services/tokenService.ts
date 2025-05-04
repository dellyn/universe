import jwt from 'jsonwebtoken';
import { 
  JWT_ACCESS_SECRET, 
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY
} from '@config/jwt';
import { RefreshTokenModel } from '../models/refreshToken';
import { UserModel } from '../models/user';

// Simple in-memory lock mechanism to prevent concurrent token refreshes
const tokenRefreshLocks = new Map<string, boolean>();

export interface TokenPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
}

export const tokenService = {
  // Generate access token
  generateAccessToken: (userId: string, email: string): string => {
    return jwt.sign(
      { userId, email, type: 'access' } as TokenPayload,
      JWT_ACCESS_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
  },

  // Generate refresh token
  generateRefreshToken: (userId: string, email: string): string => {
    return jwt.sign(
      { userId, email, type: 'refresh' } as TokenPayload,
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
  },

  // Verify access token
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

  // Verify refresh token
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

  // Generate new token pair and store refresh token in DB
  generateTokenPair: async (userId: string, email: string, req?: any): Promise<{ accessToken: string, refreshToken: string }> => {
    const accessToken = tokenService.generateAccessToken(userId, email);
    const refreshToken = tokenService.generateRefreshToken(userId, email);
    
    // Store refresh token in the database
    await RefreshTokenModel.create(userId, email, refreshToken, req);
    
    return { accessToken, refreshToken };
  },

  // Refresh tokens - validates refresh token and generates new pair
  refreshTokens: async (refreshToken: string, req?: any): Promise<{ accessToken: string, refreshToken: string } | null> => {
    // Verify refresh token
    const payload = tokenService.verifyRefreshToken(refreshToken);
    if (!payload) {
      return null;
    }

    // Check if token is already being refreshed
    if (tokenRefreshLocks.get(refreshToken)) {
      return null;
    }

    try {
      // Acquire lock
      tokenRefreshLocks.set(refreshToken, true);

      // Find token in database
      const tokenDoc = await RefreshTokenModel.findByToken(refreshToken);
      if (!tokenDoc) {
        return null;
      }

      // Verify user still exists
      const user = await UserModel.findById(tokenDoc.userId);
      if (!user) {
        await RefreshTokenModel.deleteToken(refreshToken);
        return null;
      }

      // Delete old refresh token
      await RefreshTokenModel.deleteToken(refreshToken);
      
      // Generate new token pair
      return await tokenService.generateTokenPair(user.id, user.email, req);
    } finally {
      // Release lock
      tokenRefreshLocks.delete(refreshToken);
    }
  },

  // Invalidate a refresh token
  invalidateRefreshToken: async (refreshToken: string): Promise<boolean> => {
    const payload = tokenService.verifyRefreshToken(refreshToken);
    if (!payload) {
      return false;
    }

    // Remove the refresh token from the database
    return await RefreshTokenModel.deleteToken(refreshToken);
  },

  // Invalidate all refresh tokens for a user
  invalidateAllRefreshTokens: async (userId: string): Promise<boolean> => {
    const count = await RefreshTokenModel.deleteAllUserTokens(userId);
    return count > 0;
  },

  // Get all active sessions for a user
  getUserSessions: async (userId: string): Promise<any[]> => {
    const tokens = await RefreshTokenModel.findByUserId(userId);
    return tokens.map(token => ({
      id: token.id,
      issuedAt: token.issuedAt,
      lastUsed: token.lastUsed,
      deviceInfo: token.deviceInfo
    }));
  }
}; 