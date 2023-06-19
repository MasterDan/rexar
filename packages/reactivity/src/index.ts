import { Observable } from 'rxjs';
import { container, delay, Lifecycle } from 'tsyringe';
import { IComputedBuilderOptions } from './computed/@types/IComputedBuiler';
import { ComputedBuilder } from './computed/computed-builder';
import { IRefBuilder } from './ref/@types/IRefBuilder';
import { RefBase } from './ref/base.ref';
import { ReadonlyRef } from './ref/readonly.ref';
import { WritableReadonlyRef } from './ref/readonly.ref.writable';
import { Ref } from './ref/ref';
import { RefBuilder } from './ref/ref-builder';

const buildRefModule = () => {
  const refContainer = container.createChildContainer();
  refContainer.register(
    'IRefBuilder',
    { useToken: delay(() => RefBuilder) },
    { lifecycle: Lifecycle.Singleton },
  );
  refContainer.register(
    'IComputedBuilder',
    { useToken: delay(() => ComputedBuilder) },
    { lifecycle: Lifecycle.Singleton },
  );

  const refbulder = refContainer.resolve<IRefBuilder>('IRefBuilder');
  return refbulder;
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
