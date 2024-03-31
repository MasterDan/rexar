/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import path from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig(() => ({
  resolve: {
    alias: {
      '@jsx': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: '@rexar/jsx',
      fileName: 'main',
    },
    rollupOptions: {
      external: ['@rexar/reactivity', '@rexar/tools', 'rxjs'],
      output: {
        globals: {
          '@rexar/reactivity': 'reactivity',
          '@rexar/tools': 'tools',
          'rxjs': 'rxjs',
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
