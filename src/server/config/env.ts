import dotenv from 'dotenv';
import path from 'path';

const IS_DEV = process.env.NODE_ENV !== 'production';

if (IS_DEV) {
  dotenv.config({ path: path.join(process.cwd(), '.env') });
}else{
  dotenv.config({ path: path.join(process.cwd(), '.env.production') });
}
const SERVER_PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || ' ';
const DB_NAME = process.env.DB_NAME || '';
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET  || ''
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '' 
const RESEND_TOKEN = process.env.RESEND_TOKEN || ''
const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || ''
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || ''

export { IS_DEV,  SERVER_PORT, MONGODB_URI, DB_NAME, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, RESEND_TOKEN, TEST_USER_EMAIL, TEST_USER_PASSWORD };
