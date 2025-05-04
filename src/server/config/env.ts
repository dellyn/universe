import dotenv from 'dotenv';
import path from 'path';
// import fs from 'fs';
import { getMongoDBUri } from './db';

const IS_DEV = process.env.NODE_ENV !== 'production';

if (IS_DEV) {
  dotenv.config({ path: path.join(process.cwd(), '.env') });
}

// const packageJsonPath = path.join(process.cwd(), 'package.json');
// const rawPackageJson = fs.readFileSync(packageJsonPath).toString();
// const PackageJson = JSON.parse(rawPackageJson);
// const { version: VERSION } = PackageJson;

const SERVER_PORT = process.env.PORT || 3000;
const MONGODB_URI = getMongoDBUri(IS_DEV);
const DB_NAME = process.env.DB_NAME || 'universeApp';
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET  || ''
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '' 

export { IS_DEV,  SERVER_PORT, MONGODB_URI, DB_NAME, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET };
