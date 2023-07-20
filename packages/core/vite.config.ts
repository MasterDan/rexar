/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import path from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig(() => ({
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: '@rexar/core',
      fileName: 'main',
    },
    rollupOptions: {
      external: ['rxjs', 'jsdom'],
      output: {
        globals: {
          rxjs: 'rx',
          jsdom: 'jsdom',
        },
      },
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
}));
