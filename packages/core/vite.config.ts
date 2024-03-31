/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import path from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig(() => ({
  esbuild: {
    jsxInject: 'import { h , Fragment } from "@rexar/jsx"',
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: true,
    lib: {
      entry: {
        'main': path.resolve(__dirname, 'src/index.ts'),
        'jsx-runtime': path.resolve(__dirname, 'src/jsx-runtime.ts'),
      },
      name: '@rexar/core',
      fileName: (fmt, name) => `${name}.${fmt}.js`,
    },
    rollupOptions: {
      external: ['rxjs'],
      output: {
        globals: {
          rxjs: 'rxjs',
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
