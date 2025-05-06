import { Request } from '@packages/framework';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}