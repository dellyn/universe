import { ServerResponse, IncomingMessage } from "http";

export interface Request extends IncomingMessage {
    body?: any;
    params: Record<string, string>;
    query: Record<string, string>;
  }
  
  export interface Response extends ServerResponse {
    json: (data: any, statusCode?: number) => void;
    error: (message: string, statusCode?: number) => void;
  }
  

export const ApiEndpointsPrefix = '/api/v1';
export type ApiRoute = {
    method: string;
    protected?: boolean;
    path: string;
    handler: (req: Request, res: Response) => Promise<void>;
}

