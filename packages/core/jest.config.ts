import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => ({
  verbose: false,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.html?$': 'jest-html-loader',
  },
  moduleNameMapper: {
    '@core/(.*)': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: ['@rexar/reactivity'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
});

