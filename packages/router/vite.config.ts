/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import path from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig(() => ({
  esbuild: {
    jsxInject: 'import { h , Fragment } from "@rexar/core"',
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
  resolve: {
    alias: {
      '@router': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: '@rexar/router',
      fileName: 'main',
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
}));
