import { NextFunction, Request, Response } from "@packages/framework";
import helmet from "helmet";
import * as config from '@config/env';

export function securityHeadersMiddleware(req: Request, res: Response, next: NextFunction): void {
  helmet({
    contentSecurityPolicy: config.IS_DEV ? false : {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https://api.github.com"],
        imgSrc: ["'self'", "data:", "https://*.githubusercontent.com"],
      }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "same-site" },
    referrerPolicy: {
      policy: "strict-origin-when-cross-origin"
    }
  })(req, res, next);
}