import { IncomingMessage, ServerResponse } from 'http';
import url from 'url';
import { testAlias } from '@shared/testAlias';

export async function handleApiRequest(req: IncomingMessage, res: ServerResponse) {
  try {
    const parsedUrl = url.parse(req.url || '', true);
    const pathname = parsedUrl.pathname || '';
    const query = parsedUrl.query || {};
    
    if (pathname === '/api/v1/alias' && req.method === 'GET') {
      testAlias();
      
      const responseData = {
        message: testAlias(),
        source: 'server'
      };
      
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(responseData));
      return true;
    }
    
    if (pathname === '/api/v1/' && req.method === 'GET') {
      const repoUrl = query.url as string;
      
      if (!repoUrl) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Successs' }));
        return true;
      }
      
      const responseData = {
        url: repoUrl,
        status: 'success',
      };
      
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(responseData));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error handling API request:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
    return true;
  }
} 