import { InjectionToken } from './injection-token';

export function createToken<TValue>(name: string) {
  const token = new InjectionToken<TValue>(name);
  return token;
}
