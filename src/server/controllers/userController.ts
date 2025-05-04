import { Request, Response } from '@interfaces/api';
import { StatusCodes } from 'http-status-codes';
import { UserModel, UserOutput } from '@models/user';
import { auth } from '@middleware/auth';
import { COOKIE_OPTIONS, REFRESH_COOKIE_NAME } from '../config/jwt';
// import * as cookie from 'cookie';

const sanitizeUser = (user: any): UserOutput => {
  const { id, email, createdAt, updatedAt } = user;
  return { id, email, createdAt, updatedAt };
};

const parseCookies = (cookieHeader?: string): Record<string, string> => {
  if (!cookieHeader) return {};
  
  return cookieHeader.split(';')
    .map(cookie => cookie.trim().split('='))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
};

export const userController = {
  register: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body || {};
      
      if (!email || !password) {
        return res.error('Email and password are required', StatusCodes.BAD_REQUEST);
      }
      
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.error('User with this email already exists', StatusCodes.CONFLICT);
      }
      
      const user = await UserModel.create(email, password);
      
      // Generate tokens
      const { accessToken, refreshToken } = await auth.generateToken(user.id, user.email, req);
      
      // Set refresh token as HTTP-only cookie
      res.setHeader('Set-Cookie', 
        `${REFRESH_COOKIE_NAME}=${refreshToken}; ${Object.entries(COOKIE_OPTIONS)
          .map(([key, value]) => `${key}=${value}`)
          .join('; ')}`
      );
      
      res.json({
        user: sanitizeUser(user),
        accessToken
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.error('Error registering user', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body || {};
      
      if (!email || !password) {
        return res.error('Email and password are required', StatusCodes.BAD_REQUEST);
      }
      
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.error('Invalid credentials', StatusCodes.UNAUTHORIZED);
      }
      
      const isValid = await UserModel.validatePassword(user, password);
      if (!isValid) {
        return res.error('Invalid credentials', StatusCodes.UNAUTHORIZED);
      }
      
      // Generate tokens
      const { accessToken, refreshToken } = await auth.generateToken(user.id, user.email, req);
      
      // Set refresh token as HTTP-only cookie
      res.setHeader('Set-Cookie', 
        `${REFRESH_COOKIE_NAME}=${refreshToken}; ${Object.entries(COOKIE_OPTIONS)
          .map(([key, value]) => `${key}=${value}`)
          .join('; ')}`
      );
      
      res.json({
        user: sanitizeUser(user),
        accessToken
      });
    } catch (error) {
      console.error('Login error:', error);
      res.error('Error logging in', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  
  getProfile: async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        return res.error('Authentication required', StatusCodes.UNAUTHORIZED);
      }
      
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.error('User not found', StatusCodes.NOT_FOUND);
      }
      
      res.json({ user: sanitizeUser(user) });
    } catch (error) {
      console.error('Profile error:', error);
      res.error('Error getting user profile', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  
  logout: async (req: Request, res: Response): Promise<void> => {
    try {
      // Get refresh token from cookies
      const cookies = parseCookies(req.headers.cookie);
      const refreshToken = cookies[REFRESH_COOKIE_NAME];
      
      if (refreshToken) {
        // Revoke the refresh token
        await auth.revokeToken(refreshToken);
      }
      
      // Clear refresh token cookie
      res.setHeader('Set-Cookie', 
        `${REFRESH_COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict`
      );
      
      res.json({ success: true });
    } catch (error) {
      console.error('Logout error:', error);
      res.error('Error logging out', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  
  refreshToken: async (req: Request, res: Response): Promise<void> => {
    // Early return if response is already sent
    if (res.writableEnded) {
      return;
    }

    try {
      const cookies = parseCookies(req.headers.cookie);
      const refreshToken = cookies[REFRESH_COOKIE_NAME];
      
      if (!refreshToken) {
        return clearRefreshTokenAndFail(res, 'Refresh token required');
      }
      
      // Refresh tokens using a mutex to prevent concurrent token refreshes
      const tokens = await auth.refreshTokens(refreshToken, req);
      
      // Early return if response was sent by another concurrent request
      if (res.writableEnded) {
        return;
      }
      
      if (!tokens) {
        return clearRefreshTokenAndFail(res, 'Invalid refresh token');
      }
      
      // Set new refresh token as cookie
      res.setHeader('Set-Cookie', 
        `${REFRESH_COOKIE_NAME}=${tokens.refreshToken}; ${Object.entries(COOKIE_OPTIONS)
          .map(([key, value]) => `${key}=${value}`)
          .join('; ')}`
      );
      
      // Send response with new access token
      res.json({ accessToken: tokens.accessToken });
    } catch (error) {
      // Only respond with error if response not already sent
      if (!res.writableEnded) {
        res.error('Error refreshing token', StatusCodes.INTERNAL_SERVER_ERROR);
      }
    }
  },
  
  // Add a new method to get user sessions
  getUserSessions: async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        return res.error('Authentication required', StatusCodes.UNAUTHORIZED);
      }
      
      const sessions = await auth.getUserSessions(req.user.id);
      res.json({ sessions });
    } catch (error) {
      console.error('User sessions error:', error);
      res.error('Error getting user sessions', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
  
  // Add a method to revoke a specific session
  revokeSession: async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        return res.error('Authentication required', StatusCodes.UNAUTHORIZED);
      }
      
      const { sessionId } = req.params;
      if (!sessionId) {
        return res.error('Session ID is required', StatusCodes.BAD_REQUEST);
      }
      
      const success = await auth.revokeSession(req.user.id, sessionId);
      if (!success) {
        return res.error('Session not found or already revoked', StatusCodes.NOT_FOUND);
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Revoke session error:', error);
      res.error('Error revoking session', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};

// Helper function to clear refresh token cookie and return error
const clearRefreshTokenAndFail = (res: Response, message: string): void => {
  res.setHeader('Set-Cookie', 
    `${REFRESH_COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict`
  );
  res.error(message, StatusCodes.UNAUTHORIZED);
}; 