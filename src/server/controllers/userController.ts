import { Request, Response } from '@interfaces/api';
import { UserModel } from '@models/user';
import { auth } from '@middleware/auth';

export const userController = {

  register: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body || {};
      
      if (!email || !password) {
        return res.error('Email and password are required', 400);
      }
      
      const existingUser = UserModel.findByEmail(email);
      if (existingUser) {
        return res.error('User with this email already exists', 409);
      }
      
      const user = UserModel.create(email, password);
      
      const token = auth.generateToken(user.id);
      
      res.json({
        user,
        token
      });
    } catch (error) {
      res.error('Error registering user', 500);
    }
  },
  

  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body || {};
      
      if (!email || !password) {
        return res.error('Email and password are required', 400);
      }
      
      const user = UserModel.findByEmail(email);
      if (!user) {
        return res.error('Invalid credentials', 401);
      }
      
      const isValid = UserModel.validatePassword(user, password);
      if (!isValid) {
        return res.error('Invalid credentials', 401);
      }
      const token = auth.generateToken(user.id);
      
      const { passwordHash, salt, ...safeUserData } = user;
      
      res.json({
        user: safeUserData,
        token
      });
    } catch (error) {
      res.error('Error logging in', 500);
    }
  },
  

  getProfile: async (req: Request, res: Response): Promise<void> => {
    try {
  
      res.json({ user: { id: 'test', email: 'test@test.com' } });
    } catch (error) {
      res.error('Error getting user profile', 500);
    }
  },
  
  logout: async (req: Request, res: Response): Promise<void> => {
    try {
      
      res.json({ success: true });
    } catch (error) {
      res.error('Error logging out', 500);
    }
  }
}; 