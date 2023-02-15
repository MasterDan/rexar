import { ReadonlyRef } from '../../ref/readonly.ref';

export interface IComputedBuiler {
  build<T>(fn: () => T): ReadonlyRef<T | null>;
}
