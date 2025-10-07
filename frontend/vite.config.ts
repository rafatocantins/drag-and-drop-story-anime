import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'tsconfig-paths';

// Enable tsconfig paths resolution when running Vitest without NodeNext loader
if (process.env.NODE_ENV === 'test') {
  tsconfigPaths.register({
    baseUrl: './src'
  });
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  preview: {
    port: 4173
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts']
  }
});
