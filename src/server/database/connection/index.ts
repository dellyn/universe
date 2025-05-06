import { MongoClient, Db, MongoClientOptions } from 'mongodb';
import { MONGODB_URI as DB_URI, DB_NAME } from '@config/env';

let client: MongoClient | null = null;
let database: Db | null = null;

const mongoOptions: MongoClientOptions = {
  connectTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 50,
  minPoolSize: 5,
  maxIdleTimeMS: 30000,
  waitQueueTimeoutMS: 10000,
  retryWrites: true,
  retryReads: true,
};

export async function connectDB(): Promise<Db> {
  if (database) {
    return database;
  }

  try {
    client = new MongoClient(DB_URI, mongoOptions);
    await client.connect();
    database = client.db(DB_NAME);
    console.log('Connected to MongoDB successfully');
    return database;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export function getDB(): Db {
  if (!database) {
    throw new Error('Database not connected. Call connectDB first.');
  }
  return database;
}

export async function closeDB(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    database = null;
    console.log('MongoDB connection closed');
  }
}
