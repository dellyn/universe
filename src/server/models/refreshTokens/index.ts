import { Collection, ObjectId, Db } from 'mongodb';
import { getDB } from '../../database/connection';
import { v4 as uuidv4 } from 'uuid';
import { EXPIRY } from '@config/jwt';
import { RefreshTokenDB } from './types';

// Get expiry in milliseconds from centralized config
const getExpiryMs = (): number => {
  return EXPIRY.REFRESH_TOKEN.MS;
};

function getTokenCollection(): Collection<RefreshTokenDB> {
  return getDB().collection<RefreshTokenDB>('refreshTokens');
}

// Initialize collection with TTL index
export async function initializeRefreshTokenCollection(db: Db): Promise<void> {
  console.log('Initializing refreshTokens collection...');
  
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map(c => c.name);
  
  if (!collectionNames.includes('refreshTokens')) {
    console.log('Creating refreshTokens collection...');
    await db.createCollection('refreshTokens');
  }
  
  const collection = db.collection<RefreshTokenDB>('refreshTokens');
  
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
  
  // Create other useful indices
  await collection.createIndex(
    { id: 1 },
    { unique: true }
  );
  
  await collection.createIndex(
    { userId: 1 }
  );
  
  await collection.createIndex(
    { token: 1 },
    { unique: true }
  );
  
  console.log('RefreshToken collection initialized with indices');
}

// Legacy function for backward compatibility
export async function initRefreshTokenCollection(): Promise<void> {
  const db = getDB();
  await initializeRefreshTokenCollection(db);
}

export const RefreshTokenModel = {
  create: async (
    userId: string, 
    userEmail: string, 
    token: string, 
    req?: any
  ): Promise<RefreshTokenDB> => {
    const collection = getTokenCollection();
    const now = Date.now();
    const expiryMs = getExpiryMs();
    
    const refreshToken: RefreshTokenDB = {
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
  
  findByToken: async (token: string): Promise<RefreshTokenDB | null> => {
    const collection = getTokenCollection();
    return await collection.findOne({ token });
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