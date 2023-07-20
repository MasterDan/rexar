/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import path from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig(() => ({
  resolve: {
    alias: {
      '@di': path.resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: '@rexar/logger',
      fileName: 'main',
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
}));
