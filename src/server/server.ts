import http, { IncomingMessage, ServerResponse } from 'http';
import * as config from '@config/env';
import { handleApiRequest } from '@middleware/apiHandler';
import { handleClientRequest } from '@routes/unifiedRouter';
import { connectDB } from '@database/connection';
import { initializeDatabase } from '@database/init';
import { StatusCodes } from 'http-status-codes';
import { applySecurityHeaders } from '@middleware/helmet';

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`config: ${JSON.stringify(config, null, 2)}`);

async function setupDatabase() {
  try {
    await connectDB();
    await initializeDatabase();
    console.log('Database setup complete');
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

function setupServer() {
  const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      // Apply security headers
      applySecurityHeaders(req, res);
      
      const isApiRequest = await handleApiRequest(req, res);
      
      if (!isApiRequest && !res.writableEnded) {
        await handleClientRequest(req, res);
      }
    } catch (error) {
      console.error('Error handling request:', error);
      if (!res.writableEnded) {
        res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        res.end('Internal Server Error');
      }
    }
  });

  server.listen(config.SERVER_PORT, () => {
    console.log(`App listening on port ${config.SERVER_PORT}!`);
  });

  return server;
}

// Start the application
(async () => {
  await setupDatabase();
  setupServer();
})();
