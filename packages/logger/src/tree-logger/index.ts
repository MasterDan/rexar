import { Scope } from './scope';
import { ScopedLogger } from './scoped-logger';

export function createLogger(name?: string) {
  return new ScopedLogger(new Scope(name));
}
