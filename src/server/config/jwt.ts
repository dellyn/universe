export { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from '@config/env';
// Secrets should be stored in environment variables in production
import { StringValue } from 'ms';

// Centralized expiry times
export const EXPIRY = {
  ACCESS_TOKEN: {
    DURATION: '15m',
    MS: 15 * 60 * 1000 // 15 minutes in milliseconds
  },
  REFRESH_TOKEN: {
    DURATION: '7d',
    MS: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  }
};

// Backwards compatibility
export const ACCESS_TOKEN_EXPIRY = EXPIRY.ACCESS_TOKEN.DURATION as StringValue;
export const REFRESH_TOKEN_EXPIRY = EXPIRY.REFRESH_TOKEN.DURATION as StringValue;

// Cookie settings
export const REFRESH_COOKIE_NAME = 'refresh_token';
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== 'development',
  sameSite: 'strict' as const,
  maxAge: EXPIRY.REFRESH_TOKEN.MS, // Use the centralized value
  path: '/', // Make sure path is set explicitly
}; 