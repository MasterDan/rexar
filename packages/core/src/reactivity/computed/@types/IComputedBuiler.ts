import { ReadonlyRef } from '@core/reactivity/ref/readonly.ref';
import { WritableReadonlyRef } from '@core/reactivity/ref/readonly.ref.writable';

export interface IComputedBuilderOptions {
  debounce: number;
}

export type WritableComputedArg<T> = { get: () => T; set: (value: T) => void };

export type ComputedBuilderArg<T> = (() => T) | WritableComputedArg<T>;

export interface IComputedBuiler {
  build<T>(
    fn: () => T,
    setOrOptions?: Partial<IComputedBuilderOptions>,
  ): ReadonlyRef<T>;
  build<T>(
    fn: () => T,
    setOrOptions: (val: T) => void,
    options?: Partial<IComputedBuilderOptions>,
  ): WritableReadonlyRef<T>;
}

export function isWritableComputedArg<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  val: any,
): val is WritableComputedArg<T> {
  return (
    typeof val !== 'function' &&
    typeof val === 'object' &&
    typeof val.get === 'function' &&
    typeof val.set === 'function'
  );
}
