import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  // [...]
  extensionsToTreatAsEsm: ['.ts'],
  verbose: true,
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/src/$1',
    '^@rexar/reactivity': '<rootDir>/../reactivity/src/index.ts',
    '^.+\\.html?$': '<rootDir>/jest/text.loader.js',
  },
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default jestConfig;
