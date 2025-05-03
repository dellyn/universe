import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tsconfig from './tsconfig.json';
import { normalizePathes } from '../@libraries/node/typescript/normalizePathes';

const tsConfigPaths = tsconfig.compilerOptions.paths;
const alias = normalizePathes(tsconfig.compilerOptions.paths, __dirname);
export default defineConfig({
  resolve: {
    alias,
  },
  plugins: [react({ babel: { plugins: ['babel-plugin-react-compiler'] } })],
  root: './src/client',
  build: {
    outDir: '../../dist/client',
    manifest: true, // generate manifest.json in outDir
    rollupOptions: {
      input: './src/client/client.tsx',
    },
  },
});
