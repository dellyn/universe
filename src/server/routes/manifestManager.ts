import fs from 'fs';
import path from 'path';
import { IS_DEV } from '../config/env';

let manifestCache: any;

export async function getManifest() {
  if (!manifestCache) {
    if (IS_DEV) {
      // In development, use the Vite dev server
      const port = process.env.VITE_PORT || 5173;
      manifestCache = {
        '@vite/client': {
          file: `http://localhost:${port}/@vite/client`,
        },
        'client.tsx': {
          file: `http://localhost:${port}/client.tsx`,
        },
      };
    } else {
      try {
        // In production, read from file system
        const manifestPath = path.join(process.cwd(), 'dist', 'client', '.vite', 'manifest.json');
        
        // Check if manifest exists
        if (fs.existsSync(manifestPath)) {
          const manifestStr = fs.readFileSync(manifestPath, 'utf-8').toString();
          manifestCache = JSON.parse(manifestStr);
          
          // Ensure paths are correctly formatted
          Object.keys(manifestCache).forEach((key) => {
            // Make sure paths start with / but don't include dist/client
            if (manifestCache[key].file && !manifestCache[key].file.startsWith('/')) {
              manifestCache[key].file = `/${manifestCache[key].file}`;
            }
          });
        } else {
          console.error('Manifest file not found at', manifestPath);
          // Fallback to a basic structure if manifest is missing
          manifestCache = {
            'main': {
              file: '/assets/index.js',
            }
          };
        }
      } catch (error) {
        console.error('Error loading manifest:', error);
        // Fallback to a basic structure
        manifestCache = {
          'main': {
            file: '/assets/index.js',
          }
        };
      }
    }
  }

  return manifestCache;
}
