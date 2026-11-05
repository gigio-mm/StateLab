import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    passWithNoTests: true,
    coverage: {
      include: ['src/**/*.ts'],
      reporter: ['text', 'html'],
    },
  },
});
