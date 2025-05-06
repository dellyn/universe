import { UserModel } from '@models/user';
import { AppError } from '@packages/framework';
import { ErrorKeys, User } from '@data/types';
import { StatusCodes } from 'http-status-codes';
import { authService } from '@services/auth';
import { emailService } from '@services/email';
import { UserDB } from '@models/user/types';

export const sanitizeUser = (user: UserDB): User => {
  const { id, email, createdAt, updatedAt, isEmailVerified } = user;
  return { id, email, createdAt, updatedAt, isEmailVerified };
};

export const userService = {
  register: async (email: string, password: string): Promise<UserDB> => {
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new AppError({
        code: StatusCodes.CONFLICT,
        messageKey: ErrorKeys.USER_EMAIL_EXISTS,
        message: 'User with this email already exists'
      });
    }
    
    // Validate password strength
    authService.validatePasswordStrength(password);
    
    const user = await UserModel.create(email, password);
    
    // Send verification email with code
    if (user.verificationCode) {
      console.log('Sending verification email with code:', user.verificationCode);
      await emailService.sendVerificationEmail(user.email, user.verificationCode);
    }
    
    return user;
  },
  
  verifyEmailCode: async (userId: string, code: string): Promise<UserDB> => {
    const user = await UserModel.verifyCode(userId, code);
    
    if (!user) {
      throw new AppError({
        code: StatusCodes.BAD_REQUEST,
        messageKey: ErrorKeys.USER_VERIFICATION_TOKEN_INVALID,
        message: 'Invalid or expired verification code'
      });
    }
    
    return user;
  },
  
  resendVerificationEmail: async (userId: string): Promise<boolean> => {
    const user = await UserModel.findById(userId);
    
    if (!user) {
      throw new AppError({
        code: StatusCodes.NOT_FOUND,
        messageKey: 'user.notFound',
        message: 'User not found'
      });
    }
    
    if (user.isEmailVerified) {
      return true;
    }
    
    const verification = await UserModel.generateNewVerificationCode(userId);
    if (!verification || !verification.code) {
      throw new AppError({
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        messageKey: ErrorKeys.INTERNAL_ERROR,
        message: 'Failed to generate verification code'
      });
    }
    
    return await emailService.sendVerificationEmail(user.email, verification.code);
  },
  
  getUser: async (userId: string): Promise<UserDB> => {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError({
        code: StatusCodes.NOT_FOUND,
        messageKey: ErrorKeys.USER_NOT_FOUND,
        message: 'User not found'
      });
    }
    
    return user;
  },
  
  findById: async (userId: string): Promise<UserDB | null> => {
    return await UserModel.findById(userId);
  }
}; 