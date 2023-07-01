import { Observable } from 'rxjs';
import { BindingContext } from './computed/binding-context';
import { IComputedBuilderOptions } from './computed/@types/IComputedBuilder';
import { ComputedBuilder } from './computed/computed-builder';
import { IRefBuilder } from './ref/@types/IRefBuilder';
import { RefBase } from './ref/base.ref';
import { ReadonlyRef } from './ref/readonly.ref';
import { WritableReadonlyRef } from './ref/readonly.ref.writable';
import { Ref } from './ref/ref';
import { RefBuilder } from './ref/ref-builder';
import {
  bindingContextToken,
  computedBuilderToken,
  refBuilderToken,
} from './module';

const buildRefModule = () => {
  bindingContextToken.provide(BindingContext);
  refBuilderToken.provide(RefBuilder);
  computedBuilderToken.provide(ComputedBuilder);

  const refbulder = refBuilderToken.resolve();
  return refbulder.value;
};

const builder: IRefBuilder = buildRefModule();

export function ref$<T>(
  init: () => T,
  options?: Partial<IComputedBuilderOptions>,
): ReadonlyRef<T>;
export function ref$<T>(
  init: () => T,
  set: (val: T) => void,
  options?: Partial<IComputedBuilderOptions>,
): WritableReadonlyRef<T>;
export function ref$<T>(init: Observable<T>, fallack: T): ReadonlyRef<T>;
export function ref$<T>(init: Observable<T>): ReadonlyRef<T | undefined>;
export function ref$<T>(
  init: Observable<T>,
  set: (val: T) => void,
  fallack: T,
): WritableReadonlyRef<T>;
export function ref$<T>(
  init: Observable<T>,
  set: (val: T) => void,
): WritableReadonlyRef<T | undefined>;
export function ref$<T>(): Ref<T | undefined>;
export function ref$<T>(init: T): Ref<T>;
export function ref$<T>(
  init?: T | Observable<T> | (() => T),
  optionsOrSetterfallack?:
    | T
    | Partial<IComputedBuilderOptions>
    | ((val: T) => void),
  setOrOptions?: Partial<IComputedBuilderOptions> | ((val: T) => void),
): Ref<T | undefined> | ReadonlyRef<T> | ReadonlyRef<T | undefined> {
  return builder.buildRef(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    init as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    optionsOrSetterfallack as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setOrOptions as any,
  );
}

export function readonly<T>(ref: RefBase<T>): ReadonlyRef<T> {
  return builder.makeReadonly(ref);
}

export type { MaybeObservable } from './@types/MaybeObservable';
export type { MayBeReadonlyRef } from './ref/@types/MayBeReadonlyRef';
