import { Observable } from 'rxjs';
import { container, delay, Lifecycle } from 'tsyringe';
import { ComputedBuilder } from '../computed/computed-builder';
import { IRefBuilder } from './@types/IRefBuilder';
import { ReadonlyRef } from './readonly.ref';
import { Ref } from './ref';
import { RefBuilder } from './ref-builder';

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

export function ref$<T>(init: () => T): ReadonlyRef<T>;
export function ref$<T>(init: Observable<T>, fallack: T): ReadonlyRef<T>;
export function ref$<T>(init: Observable<T>): ReadonlyRef<T | undefined>;
export function ref$<T>(): Ref<T | undefined>;
export function ref$<T>(init: T): Ref<T>;
export function ref$<T>(init?: T): Ref<T | undefined> {
  return builder.buildRef(init);
}
