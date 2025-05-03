import http, { IncomingMessage, ServerResponse } from 'http';
import * as config from './config';
import { handleApiRequest } from './routes/api-router';
import { handleClientRequest } from './routes/unified-router';

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`config: ${JSON.stringify(config, null, 2)}`);

function setupServer() {
  const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const isApiRequest = await handleApiRequest(req, res);
      
      if (!isApiRequest) {
        await handleClientRequest(req, res);
      }
    } catch (error) {
      console.error('Error handling request:', error);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  server.listen(config.SERVER_PORT, () => {
    console.log(`App listening on port ${config.SERVER_PORT}!`);
  });

  return server;
}

setupServer();
