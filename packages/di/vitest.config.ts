/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@di': path.resolve(__dirname, './src'),
    },
  },
});
