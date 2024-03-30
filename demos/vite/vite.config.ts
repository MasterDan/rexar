/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsxInject: `import { h, fragment } from '@rexar/core'`,
    jsxFactory: 'h',
    jsxFragment: 'fragment',
  },
});
