import { IncomingMessage, ServerResponse } from 'http';
import url from 'url';
import { StatusCodes } from 'http-status-codes';
import { auth } from './auth';
import { enhanceRequest, enhanceResponse, extractPathParams } from '../utils/api';
import { routes } from '../routes/apiRoutes';

export async function handleApiRequest(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  try {
    const parsedUrl = url.parse(req.url || '', true);
    const pathname = parsedUrl.pathname || '';
    
    if (!pathname.startsWith('/api/')) {
      return false;
    }
    
    const enhancedReq = await enhanceRequest(req);
    const enhancedRes = enhanceResponse(res);
    console.log('enhancedReq', enhancedReq.url);
    
    // Find matching route
    for (const route of routes) {
      if (route.method !== req.method) {
        continue;
      }
      
      const params = extractPathParams(route.path, pathname);
      if (params === null) {
        continue; // No match
      }
      
      enhancedReq.params = params;
      
      if (route.protected) {
        // Apply authentication middleware
        return await auth.authenticateRequest(enhancedReq, enhancedRes, async () => {
          await route.handler(enhancedReq, enhancedRes);
          return true;
        });
      } else {
        await route.handler(enhancedReq, enhancedRes);
        return true;
      }
    }
    
    // No route found
    enhancedRes.error('Not Found', StatusCodes.NOT_FOUND);
    return true;
  } catch (error) {
    console.error('Error handling API request:', error);
    res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
    return true;
  }
} 