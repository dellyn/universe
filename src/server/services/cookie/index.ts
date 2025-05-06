import { Response } from '@packages/framework';
import { COOKIE_OPTIONS, REFRESH_COOKIE_NAME } from '@config/jwt';

export const cookieService = {
  parseCookies: (cookieHeader?: string): Record<string, string> => {
    if (!cookieHeader) return {};
    
    return cookieHeader.split(';')
      .map(cookie => cookie.trim().split('='))
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  },
  
  setRefreshTokenCookie: (res: Response, refreshToken: string): void => {
    res.setHeader('Set-Cookie', 
      `${REFRESH_COOKIE_NAME}=${refreshToken}; ${Object.entries(COOKIE_OPTIONS)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')}`
    );
  },
  
  clearRefreshTokenCookie: (res: Response): void => {
    res.setHeader('Set-Cookie', 
      `${REFRESH_COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict`
    );
  }
}; 