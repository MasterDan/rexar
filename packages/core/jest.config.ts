import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  // [...]
  moduleFileExtensions: ['js', 'ts', 'html'],
  extensionsToTreatAsEsm: ['.ts'],
  verbose: true,
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/src/$1',
    '^@rexar/reactivity': '<rootDir>/../reactivity/src/index.ts',
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
    '^.+\\.html?$': '<rootDir>/jest/text.loader.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default jestConfig;
