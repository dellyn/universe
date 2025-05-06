import { ObjectId } from "mongodb";

export interface UserDB {
  _id?: ObjectId;
  id: string;
  email: string;
  passwordHash: string;
  isEmailVerified: boolean;
  verificationCode?: string;
  verificationCodeExpires?: number;
  createdAt: number;
  updatedAt: number;
}