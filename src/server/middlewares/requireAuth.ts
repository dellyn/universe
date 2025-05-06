import { NextFunction, Request, Response } from '@packages/framework';
import { StatusCodes } from 'http-status-codes';
import { tokenService } from '@services/auth/tokenService';
import { AuthenticatedRequest } from '@services/auth/types';

function extractTokenFromHeader(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
}

export const requireAuthMiddleware = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  const token = extractTokenFromHeader(req as any);
  
  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).json({ 
      error: 'Authentication required' 
    });
    return;
  }
  
  try {
    const payload = tokenService.verifyAccessToken(token);
    if (!payload || !payload.userId ) {
      res.status(StatusCodes.UNAUTHORIZED).json({ 
        error: 'Invalid or expired token' 
      });
      return;
    }
    
    (req as AuthenticatedRequest).user = {
      id: payload.userId,
      email: payload.email
    };
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(StatusCodes.UNAUTHORIZED).json({ 
      error: 'Authentication failed' 
    });
  }
}; 