import { connectDB, getDB, closeDB } from './connection';
import { initRefreshTokenCollection } from '../models/refreshToken';

/**
 * Initialize the database with required collections and indexes
 */
export async function initializeDatabase(): Promise<void> {
  try {
    await connectDB();
    const db = getDB();
    
    // Create collections if they don't exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Users collection
    if (!collectionNames.includes('users')) {
      console.log('Creating users collection...');
      await db.createCollection('users');
    }
    
    // RefreshTokens collection
    if (!collectionNames.includes('refreshTokens')) {
      await db.createCollection('refreshTokens');
    }
    
    // Create indexes for collections
    
    // Email index for users (for lookups and ensuring uniqueness)
    await db.collection('users').createIndex(
      { email: 1 }, 
      { unique: true }
    );
    
    // ID index for users (for faster lookups by UUID)
    await db.collection('users').createIndex(
      { id: 1 }, 
      { unique: true }
    );
    
    // Initialize TTL index for refresh tokens
    await initRefreshTokenCollection();
    
    // ID index for refresh tokens
    await db.collection('refreshTokens').createIndex(
      { id: 1 },
      { unique: true }
    );
    
    // User ID index for refresh tokens (to find all tokens for a user)
    await db.collection('refreshTokens').createIndex(
      { userId: 1 }
    );
    
    // Token index for refresh tokens (to find by token value)
    await db.collection('refreshTokens').createIndex(
      { token: 1 },
      { unique: true }
    );
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// When this script is run directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database initialization completed');
      return closeDB();
    })
    .catch(error => {
      console.error('Database initialization failed:', error);
      process.exit(1);
    });
} 