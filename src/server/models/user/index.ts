import bcrypt from 'bcrypt';
import { Collection, ObjectId, Db } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { getDB } from '@database/connection';
import { UserDB } from './types';

const SALT_ROUNDS = 10;

function getUserCollection(): Collection<UserDB> {
  return getDB().collection<UserDB>('users');
}

function generateVerificationCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function initializeUserCollection(db: Db): Promise<void> {
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map(c => c.name);
  
  if (!collectionNames.includes('users')) {
    await db.createCollection('users');
  }
  
  await db.collection('users').createIndex(
    { email: 1 }, 
    { unique: true }
  );
  
  await db.collection('users').createIndex(
    { id: 1 }, 
    { unique: true }
  );
}

export const UserModel = {
  findByEmail: async (email: string): Promise<UserDB | null> => {
    const collection = getUserCollection();
    return await collection.findOne({ email: email.toLowerCase() });
  },

  findById: async (id: string): Promise<UserDB | null> => {
    const collection = getUserCollection();
    return await collection.findOne({ id });
  },

  create: async (email: string, password: string): Promise<UserDB> => {
    const collection = getUserCollection();
    const now = Date.now();
    
    // Generate password hash
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    
    const verificationCode = generateVerificationCode();
    const verificationExpiry = now + (30 * 60 * 1000); // 30 minutes
    
    const user: UserDB = {
      id: uuidv4(),
      email: email.toLowerCase(),
      passwordHash,
      isEmailVerified: false,
      verificationCode,
      verificationCodeExpires: verificationExpiry,
      createdAt: now,
      updatedAt: now
    };
    
    await collection.insertOne(user);
    return user;
  },

  update: async (id: string, data: Partial<UserDB>): Promise<UserDB | null> => {
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


  validatePassword: async (user: UserDB, password: string): Promise<boolean> => {
    return bcrypt.compare(password, user.passwordHash);
  },

  verifyCode: async (userId: string, code: string): Promise<UserDB | null> => {
    const collection = getUserCollection();
    const now = Date.now();
    
    const user = await collection.findOne({ 
      id: userId,
      verificationCode: code,
      verificationCodeExpires: { $gt: now }
    });
    
    if (!user) {
      return null;
    }
    
    await collection.updateOne(
      { id: user.id },
      { 
        $set: { 
          isEmailVerified: true,
          updatedAt: now
        },
        $unset: { 
          verificationCode: "",
          verificationCodeExpires: ""
        }
      }
    );
    
    return await UserModel.findById(user.id);
  },

  generateNewVerificationCode: async (userId: string): Promise<{ code: string, expires: number } | null> => {
    const collection = getUserCollection();
    const now = Date.now();
    const verificationCode = generateVerificationCode();
    const verificationExpiry = now + (30 * 60 * 1000); // 30 minutes
    
    const result = await collection.updateOne(
      { id: userId },
      { 
        $set: { 
          verificationCode,
          verificationCodeExpires: verificationExpiry,
          updatedAt: now
        }
      }
    );
    
    if (result.modifiedCount === 0) {
      return null;
    }
    
    return {
      code: verificationCode,
      expires: verificationExpiry
    };
  }
};