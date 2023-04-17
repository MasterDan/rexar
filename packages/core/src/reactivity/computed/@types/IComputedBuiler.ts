import { ReadonlyRef } from '../../ref/readonly.ref';

export interface IComputedBuilderOptions {
  debounce: number;
}

export interface IComputedBuiler {
  build<T>(
    fn: () => T,
    options?: IComputedBuilderOptions,
  ): ReadonlyRef<T | null>;
}
