/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsxInject: `import { h, Fragment } from '@rexar/core'`,
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
});
