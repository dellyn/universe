import fs from 'fs';
import path from 'path';
import url from 'url';
import { IncomingMessage, ServerResponse } from 'http';
import ejs from 'ejs';
import { getManifest } from './manifestManager';
import * as config from '../config';


export async function handleClientRequest(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  try {
    const parsedUrl = url.parse(req.url || '', true);
    const pathname = parsedUrl.pathname || '';
    
    // Handle static assets in production mode
    if (!config.IS_DEV && pathname.startsWith('/assets/')) {
      const filePath = path.join(process.cwd(), 'dist', 'client', pathname);
      
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath);
        
        // Set content type based on file extension
        const ext = path.extname(filePath).toLowerCase();
        const contentTypeMap: Record<string, string> = {
          '.js': 'application/javascript',
          '.css': 'text/css',
          '.json': 'application/json',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.gif': 'image/gif',
          '.svg': 'image/svg+xml',
          '.ico': 'image/x-icon',
        };
        
        res.setHeader('Content-Type', contentTypeMap[ext] || 'application/octet-stream');
        res.statusCode = 200;
        res.end(fileContent);
        return true;
      }
    }
    

    const manifest = await getManifest();
    const templatePath = path.join(process.cwd(), 'views', 'page.ejs');
    const template = fs.readFileSync(templatePath, 'utf8');
    
    const html = ejs.render(template, { 
      IS_DEV: config.IS_DEV, 
      manifest 
    });
    
    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 200;
    res.end(html);
    return true;
    
  } catch (error) {
    console.error('Error handling client request:', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
    return true;
  }
} 