import fs from 'fs';

export function getMongoDBUri(isDev: boolean): string {
  let mongoDbUri = process.env.MONGODB_URI || '';
  
  if (!isDev && !mongoDbUri) {
    try {
      const secretPath = '/run/secrets/mongodb_uri';
      if (fs.existsSync(secretPath)) {
        mongoDbUri = fs.readFileSync(secretPath, 'utf8').trim();
        console.log('MongoDB URI loaded from Docker secret');
      }
    } catch (error) {
      console.error('Error reading MongoDB URI from secret:', error);
    }
  }
  
  return mongoDbUri;
} 