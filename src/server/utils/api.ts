import { IncomingMessage, ServerResponse } from 'http';
import url from 'url';
import { match } from 'path-to-regexp';
import { Request, Response } from '@interfaces/api';

export function enhanceRequest(req: IncomingMessage): Promise<Request> {
  return new Promise((resolve) => {
    const enhancedReq = req as Request;
    const parsedUrl = url.parse(req.url || '', true);
    
    enhancedReq.query = parsedUrl.query as Record<string, string>;
    
    if (['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method || '')) {
 
      resolve(enhancedReq);
    } else {
      resolve(enhancedReq);
    }
  });
}

export function enhanceResponse(res: ServerResponse): Response {
  const enhancedRes = res as Response;
  
  enhancedRes.json = (data: any, statusCode = 200) => {
    enhancedRes.statusCode = statusCode;
    enhancedRes.setHeader('Content-Type', 'application/json');
    enhancedRes.end(JSON.stringify(data));
  };
  
  enhancedRes.error = (message: string, statusCode = 500) => {
    enhancedRes.statusCode = statusCode;
    enhancedRes.setHeader('Content-Type', 'application/json');
    enhancedRes.end(JSON.stringify({ error: message }));
  };
  
  return enhancedRes;
}

export function extractPathParams(
  path: string,
  pathname: string
): Record<string, string> | null {
  const matchFn = match(path, { decode: decodeURIComponent });
  const result = matchFn(pathname);
  
  if (!result) {
    return null;
  }
  
  return result.params as Record<string, string>;
} 