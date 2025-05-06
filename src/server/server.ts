import framework from '@packages/framework';
import * as config from '@config/env';
import { connectDB } from '@database/connection';
import { initializeDatabase } from '@database/intitialization';
import { errorHandlerMiddleware } from './middlewares';
import { applyRateLimiting } from './middlewares';
import { securityHeadersMiddleware } from './middlewares';
import {apiRouter, API_ENDPOINT } from '@routes/api';
import { clientRouter } from '@routes/client';
import cors from 'cors';
import cookieParser from 'cookie-parser';

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`config: ${JSON.stringify(config, null, 2)}`);

function setupServer() {
  const app = framework();
  
  app.use(framework.json());
  app.use(framework.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(securityHeadersMiddleware);
  app.use(cors());
  app.use(applyRateLimiting);
  app.use(API_ENDPOINT, apiRouter);
  app.use(clientRouter);
  app.use(errorHandlerMiddleware);

  const server = app.listen(config.SERVER_PORT, () => {
    console.log(`Listening on port ${config.SERVER_PORT}!`);
  });

  return server;
}

async function setupDatabase() {
  try {
    await connectDB();
    await initializeDatabase();
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

(async () => {
  await setupDatabase();
  setupServer();
})();
