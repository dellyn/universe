import { Request, Response } from '@interfaces/api';


export const auth = {

  generateToken: (userId: string): string => {
  const token = 'token';
    
    return token;
  },
  

  authenticateRequest: async (
    req: Request, 
    res: Response, 
    next: () => Promise<boolean>
  ): Promise<boolean> => {
    
    return next();
  },
  
  revokeToken: (token: string): boolean => {

    return true;
  }
}; 