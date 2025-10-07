import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/tests/**/*.test.ts'],
    globals: true,
    environment: 'node',
    setupFiles: ['./vitest.setup.ts']
  }
});
