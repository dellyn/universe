import { Collection, ObjectId } from 'mongodb';
import { getDB } from '../database/connection';
import { v4 as uuidv4 } from 'uuid';
import { EXPIRY } from '@config/jwt';

export interface RefreshToken {
  _id?: ObjectId;
  id: string;
  token: string;
  userId: string;
  userEmail: string;
  issuedAt: number;
  expiresAt: number;
  lastUsed?: number;
  deviceInfo?: {
    ip: string;
    userAgent: string;
  };
}

// Get expiry in milliseconds from centralized config
const getExpiryMs = (): number => {
  return EXPIRY.REFRESH_TOKEN.MS;
};

function getTokenCollection(): Collection<RefreshToken> {
  return getDB().collection<RefreshToken>('refreshTokens');
}

// Initialize collection with TTL index
export async function initRefreshTokenCollection(): Promise<void> {
  const collection = getTokenCollection();
  
  // Check if the TTL index already exists
  const indexes = await collection.indexes();
  const ttlIndexExists = indexes.some(index => 
    index.name === 'expiresAt_ttl_index'
  );
  
  if (!ttlIndexExists) {
    // Create a TTL index that automatically removes expired tokens
    await collection.createIndex(
      { expiresAt: 1 }, 
      { 
        expireAfterSeconds: 0,
        name: 'expiresAt_ttl_index'
      }
    );
  }
  
  console.log('RefreshToken collection initialized with TTL index');
}

export const RefreshTokenModel = {
  create: async (
    userId: string, 
    userEmail: string, 
    token: string, 
    req?: any
  ): Promise<RefreshToken> => {
    const collection = getTokenCollection();
    const now = Date.now();
    const expiryMs = getExpiryMs();
    
    const refreshToken: RefreshToken = {
      id: uuidv4(),
      token,
      userId,
      userEmail,
      issuedAt: now,
      expiresAt: new Date(now + expiryMs).getTime(),
      deviceInfo: req ? {
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      } : undefined
    };
    
    await collection.insertOne(refreshToken);
    return refreshToken;
  },
  
  findByToken: async (token: string): Promise<RefreshToken | null> => {
    const collection = getTokenCollection();
    return await collection.findOne({ token });
  },
  
  findByUserId: async (userId: string): Promise<RefreshToken[]> => {
    const collection = getTokenCollection();
    return await collection.find({ userId }).toArray();
  },
  
  updateLastUsed: async (id: string): Promise<boolean> => {
    const collection = getTokenCollection();
    const result = await collection.updateOne(
      { id },
      { $set: { lastUsed: Date.now() } }
    );
    return result.modifiedCount === 1;
  },
  
  deleteToken: async (token: string): Promise<boolean> => {
    const collection = getTokenCollection();
    const result = await collection.deleteOne({ token });
    return result.deletedCount === 1;
  },
  
  deleteAllUserTokens: async (userId: string): Promise<number> => {
    const collection = getTokenCollection();
    const result = await collection.deleteMany({ userId });
    return result.deletedCount || 0;
  },
  
  deleteExpiredTokens: async (): Promise<number> => {
    const collection = getTokenCollection();
    const now = Date.now();
    const result = await collection.deleteMany({
      expiresAt: { $lt: now }
    });
    return result.deletedCount || 0;
  }
}; 