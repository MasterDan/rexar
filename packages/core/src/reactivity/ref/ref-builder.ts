import { MaybeObservable } from '@core/@types/MaybeObservable';
import { isObservable, Observable } from 'rxjs';
import { inject, injectable } from 'tsyringe';
import { ReadonlyRef } from './readonly.ref';
import { RefBase } from './base.ref';
import { Ref } from './ref';
import { IRefBuilder } from './@types/IRefBuilder';
import type {
  IComputedBuilderOptions,
  IComputedBuiler,
} from '../computed/@types/IComputedBuiler';
import { WritableReadonlyRef } from './readonly.ref.writable';

@injectable()
export class RefBuilder implements IRefBuilder {
  constructor(
    @inject('IComputedBuilder')
    private computedBuilder: IComputedBuiler,
  ) {}

  buildRef<T>(
    init: () => T,
    options?: Partial<IComputedBuilderOptions>,
  ): ReadonlyRef<T>;
  buildRef<T>(
    init: () => T,
    set: (val: T) => void,
    options?: Partial<IComputedBuilderOptions>,
  ): WritableReadonlyRef<T>;
  buildRef<T>(
    init: Observable<T>,
    set: (val: T) => void,
    fallack: T,
  ): WritableReadonlyRef<T>;
  buildRef<T>(
    init: Observable<T>,
    set: (val: T) => void,
  ): WritableReadonlyRef<T | undefined>;
  buildRef<T>(init: Observable<T>, fallack: T): ReadonlyRef<T>;
  buildRef<T>(init: Observable<T>): ReadonlyRef<T | undefined>;
  buildRef<T>(): Ref<T | undefined>;
  buildRef<T>(init: T): Ref<T>;
  buildRef<T>(
    init?: MaybeObservable<T> | (() => T),
    osfOne?: T | Partial<IComputedBuilderOptions> | ((val: T) => void),
    osfTwo?: Partial<IComputedBuilderOptions> | ((val: T) => void) | T,
  ) {
    // creating computed
    if (typeof init === 'function') {
      // writable or "normal"
      return typeof osfOne === 'function'
        ? this.computedBuilder.build(
            init as () => T,
            osfOne as (arg: T) => void,
            osfTwo as Partial<IComputedBuilderOptions>,
          )
        : this.computedBuilder.build(
            init as () => T,
            osfOne as Partial<IComputedBuilderOptions>,
          );
    }

    // creating readonly ref, based on observable
    if (isObservable(init)) {
      // or may be writable readonly ref
      if (typeof osfOne === 'function') {
        const setter = osfOne;
        const fallback = osfTwo as T;
        return fallback
          ? new WritableReadonlyRef<T>(
              init,
              fallback,
              setter as (arg: T) => void,
            )
          : new WritableReadonlyRef<T | undefined>(
              init,
              fallback,
              setter as (val: T | undefined) => void,
            );
      }
      const fallack = osfOne as T;
      return fallack
        ? new ReadonlyRef<T>(init, fallack)
        : new ReadonlyRef<T | undefined>(init, fallack);
    }
    // creating classic ref, based on behavior subject
    return init ? new Ref<T>(init) : new Ref<T | undefined>(init);
  }

  makeReadonly<T>(ref: RefBase<T>) {
    return this.buildRef(ref, ref.value);
  }
}
