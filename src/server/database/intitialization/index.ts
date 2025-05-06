import { connectDB, getDB } from '@database/connection';
import { initializeRefreshTokenCollection } from '@models/refreshTokens';
import { initializeUserCollection } from '@models/user';
import { initializeTestEnvironment } from './testEnvironment';

async function isDatabaseInitialized(db: any): Promise<boolean> {
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map((c: any) => c.name);
  
  const requiredCollections = ['users', 'refreshTokens'];
  const allCollectionsExist = requiredCollections.every(name => 
    collectionNames.includes(name)
  );

  return allCollectionsExist
}

export async function initializeDatabase(): Promise<void> {
  try {
    await connectDB();
    const db = getDB();
    
    const isInitialized = await isDatabaseInitialized(db);
    if (isInitialized) {
      return;
    }
    
    await initializeUserCollection(db);
    await initializeRefreshTokenCollection(db);
    await initializeTestEnvironment();
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}
