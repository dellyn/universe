import { Router, Request, Response } from '@packages/framework';
import path from 'path';
import fs from 'fs';
import ejs from 'ejs';
import { StatusCodes } from 'http-status-codes';
import * as config from '@config/env';
import { getManifest } from '@routes/manifestManager';
import framework from '@packages/framework';

const clientRouter = Router();

if (!config.IS_DEV) {
  clientRouter.use('/assets', framework.static(path.join(process.cwd(), 'dist', 'client', 'assets')));
}


async function renderClient(req: Request, res: Response): Promise<void> {
  try {
    const manifest = await getManifest();
    const templatePath = path.join(process.cwd(), 'views', 'page.ejs');
    const template = fs.readFileSync(templatePath, 'utf8');
    
    const html = ejs.render(template, { 
      IS_DEV: config.IS_DEV, 
      manifest 
    });
    
    res.setHeader('Content-Type', 'text/html');
    res.status(StatusCodes.OK).send(html);
  } catch (error) {
    console.error('Error rendering client app:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Internal Server Error');
  }
}

clientRouter.get('*', renderClient);

export { clientRouter, renderClient };