import { IncomingMessage, ServerResponse } from 'http';
import url from 'url';
import { auth } from '../middleware/auth';
import { enhanceRequest, enhanceResponse, extractPathParams} from '../utils/api';
import { userRoutes } from '@routes/userRoutes';
import { authRoutes } from '@routes/authRoutes';
import { ApiRoute } from '@interfaces/api';

const routes = [
  ...authRoutes,
  ...userRoutes,
] as ApiRoute[];

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
    enhancedRes.error('Not Found', 404);
    return true;
  } catch (error) {
    console.error('Error handling API request:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
    return true;
  }
} 