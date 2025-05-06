export { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from '@config/env';
import { StringValue } from 'ms';

export const EXPIRY = {
  ACCESS_TOKEN: {
    DURATION: '15m',
    MS: 15 * 60 * 1000 
  },
  REFRESH_TOKEN: {
    DURATION: '7d',
    MS: 7 * 24 * 60 * 60 * 1000 
  }
};

export const ACCESS_TOKEN_EXPIRY = EXPIRY.ACCESS_TOKEN.DURATION as StringValue;
export const REFRESH_TOKEN_EXPIRY = EXPIRY.REFRESH_TOKEN.DURATION as StringValue;

export const REFRESH_COOKIE_NAME = 'refresh_token';
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== 'development' ,
  sameSite: 'strict' as const,
  maxAge: EXPIRY.REFRESH_TOKEN.MS, 
  path: '/',
}; 