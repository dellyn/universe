import bcrypt from 'bcrypt';
import { Collection, ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { getDB } from '../database/connection';

export interface User {
  _id?: ObjectId;
  id: string;
  email: string;
  passwordHash: string;
  createdAt: number;
  updatedAt: number;
}

export interface CreateUserInput {
  email: string;
  password: string;
}

export interface UserOutput {
  id: string;
  email: string;
  createdAt: number;
  updatedAt: number;
}

const SALT_ROUNDS = 10;

function getUserCollection(): Collection<User> {
  return getDB().collection<User>('users');
}

export const UserModel = {
  findByEmail: async (email: string): Promise<User | null> => {
    const collection = getUserCollection();
    return await collection.findOne({ email: email.toLowerCase() });
  },

  findById: async (id: string): Promise<User | null> => {
    const collection = getUserCollection();
    return await collection.findOne({ id });
  },

  create: async (email: string, password: string): Promise<User> => {
    const collection = getUserCollection();
    const now = Date.now();
    
    // Generate password hash
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    
    const user: User = {
      id: uuidv4(),
      email: email.toLowerCase(),
      passwordHash,
      createdAt: now,
      updatedAt: now
    };
    
    await collection.insertOne(user);
    return user;
  },

  update: async (id: string, data: Partial<User>): Promise<User | null> => {
    const collection = getUserCollection();
    const updateData = {
      ...data,
      updatedAt: Date.now()
    };
    
    await collection.updateOne(
      { id },
      { $set: updateData }
    );
    
    return await UserModel.findById(id);
  },

  delete: async (id: string): Promise<boolean> => {
    const collection = getUserCollection();
    const result = await collection.deleteOne({ id });
    return result.deletedCount === 1;
  },

  validatePassword: async (user: User, password: string): Promise<boolean> => {
    return bcrypt.compare(password, user.passwordHash);
  }
};