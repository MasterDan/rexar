import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => ({
  verbose: false,
  transform: {
    '\\.[jt]s$': 'ts-jest',
    '^.+\\.html?$': 'jest-html-loader',
  },
  moduleNameMapper: {
    '@core/(.*)': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
});
