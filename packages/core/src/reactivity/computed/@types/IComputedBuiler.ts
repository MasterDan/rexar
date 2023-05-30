import { WritableReadonlyRef } from '@core/reactivity/ref/readonly.ref.writable';
import { ReadonlyRef } from '../../ref/readonly.ref';

export interface IComputedBuilderOptions {
  debounce: number;
}

export type ComputedBuilderArg<T> =
  | (() => T)
  | { get: () => T; set: (value: T) => void };

export interface IComputedBuiler {
  build<T>(
    fn: () => T,
    options?: IComputedBuilderOptions,
  ): ReadonlyRef<T | null>;
  build<T>(
    fn: { get: () => T; set: (value: T) => void },
    options?: IComputedBuilderOptions,
  ): WritableReadonlyRef<T | null>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isComputedArg<T>(val: any): val is ComputedBuilderArg<T> {
  return (
    typeof val === 'function' ||
    (typeof val === 'object' &&
      typeof val.get === 'function' &&
      typeof val.set === 'function')
  );
}
