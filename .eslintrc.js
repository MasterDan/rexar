module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['import', '@typescript-eslint'],
  root: true,
  parserOptions: {
    project: [
      './packages/tools/tsconfig.json',
      './packages/reactivity/tsconfig.json',
      './packages/core/tsconfig.json',
      './packages/example/tsconfig.json',
      './packages/logger/tsconfig.json',
    ],
  },
  rules: {
    'no-console':
      process.env.NODE_ENV === 'production'
        ? ['error', { allow: ['warn', 'error'] }]
        : ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        caughtErrorsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      },
    ],
    'import/prefer-default-export': 'off',
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': 'error',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    'no-param-reassign': ['error', { props: false }],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        project: 'packages/*/tsconfig.json',
      },
    },
  },
};
