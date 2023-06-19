import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => ({
  verbose: false,
  transform: {
    '\\.[jt]s$': 'ts-jest',
  },
  moduleNameMapper: {
    '@reactivity/(.*)': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
});
