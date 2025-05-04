import { IncomingMessage, ServerResponse } from 'http';
import url from 'url';
import { match } from 'path-to-regexp';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from '@interfaces/api';

export function enhanceRequest(req: IncomingMessage): Promise<Request> {
  return new Promise((resolve) => {
    const enhancedReq = req as Request;
    const parsedUrl = url.parse(req.url || '', true);
    
    enhancedReq.query = parsedUrl.query as Record<string, string>;
    
    if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
      let body = '';
      
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      
      req.on('end', () => {
        try {
          if (body) {
            enhancedReq.body = JSON.parse(body);
          } else {
            enhancedReq.body = {};
          }
          resolve(enhancedReq);
        } catch (e) {
          enhancedReq.body = {}; 
          resolve(enhancedReq);
        }
      });
    } else {
      resolve(enhancedReq);
    }
  });
}

export function enhanceResponse(res: ServerResponse): Response {
  const enhancedRes = res as Response;
  
  enhancedRes.json = (data: any, statusCode = StatusCodes.OK) => {
    if (enhancedRes.writableEnded) {
      console.warn('Attempted to send JSON response after response was already sent');
      return enhancedRes;
    }
    
    enhancedRes.statusCode = statusCode;
    enhancedRes.setHeader('Content-Type', 'application/json');
    enhancedRes.end(JSON.stringify(data));
    return enhancedRes;
  };
  
  enhancedRes.error = (message: string, statusCode = StatusCodes.INTERNAL_SERVER_ERROR) => {
    if (enhancedRes.writableEnded) {
      console.warn('Attempted to send error response after response was already sent');
      return enhancedRes;
    }
    
    enhancedRes.statusCode = statusCode;
    enhancedRes.setHeader('Content-Type', 'application/json');
    enhancedRes.end(JSON.stringify({ error: message }));
    return enhancedRes;
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