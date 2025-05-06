import fs from 'fs';
import path from 'path';
import { IS_DEV } from '../config/env';

let manifestCache: any;

/**
 * Retrieves Vite manifest for asset loading
 * @returns Promise<object> Manifest object with file paths
 */
export async function getManifest() {
  if (!manifestCache) {
    if (IS_DEV) {
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
        const manifestPath = path.join(process.cwd(), 'dist', 'client', '.vite', 'manifest.json');
        
        if (fs.existsSync(manifestPath)) {
          const manifestStr = fs.readFileSync(manifestPath, 'utf-8').toString();
          manifestCache = JSON.parse(manifestStr);
          
          Object.keys(manifestCache).forEach((key) => {
            if (manifestCache[key].file && !manifestCache[key].file.startsWith('/')) {
              manifestCache[key].file = `/${manifestCache[key].file}`;
            }
            
            // Ensure CSS file paths are absolute
            if (manifestCache[key].css) {
              manifestCache[key].css = manifestCache[key].css.map((cssFile: string) => {
                return cssFile.startsWith('/') ? cssFile : `/${cssFile}`;
              });
            }
          });
        } else {
          console.error('Manifest file not found at', manifestPath);
          manifestCache = {
            'main': {
              file: '/assets/index.js',
            }
          };
        }
      } catch (error) {
        console.error('Error loading manifest:', error);
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
