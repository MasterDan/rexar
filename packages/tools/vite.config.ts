/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import path from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig(() => ({
  resolve: {
    alias: {
      '@tools': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: '@rexar/tools',
      fileName: 'main',
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
}));
