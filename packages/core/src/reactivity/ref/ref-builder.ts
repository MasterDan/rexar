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

  buildRef<T>(init: () => T, options?: IComputedBuilderOptions): ReadonlyRef<T>;
  buildRef<T>(
    init: () => T,
    set: (val: T) => void,
    options?: IComputedBuilderOptions,
  ): WritableReadonlyRef<T>;
  buildRef<T>(
    init: Observable<T>,
    fallack: T,
    set: (val: T) => void,
  ): WritableReadonlyRef<T>;
  buildRef<T>(
    init: Observable<T>,
    fallack: undefined,
    set: (val: T) => void,
  ): WritableReadonlyRef<T | undefined>;
  buildRef<T>(init: Observable<T>): ReadonlyRef<T>;
  buildRef<T>(init: Observable<T>): ReadonlyRef<T | undefined>;
  buildRef<T>(): Ref<T | undefined>;
  buildRef<T>(init: T): Ref<T>;
  buildRef<T>(
    init?: MaybeObservable<T> | (() => T),
    optionsOrSetterOrfallack?: T | IComputedBuilderOptions | ((val: T) => void),
    set?: IComputedBuilderOptions | ((val: T) => void),
  ) {
    if (typeof init === 'function') {
      return this.computedBuilder.build(
        init as () => T,
        optionsOrSetterOrfallack as IComputedBuilderOptions,
      );
    }
    const fallack = optionsOrSetterOrfallack as T | undefined;

    if (isObservable(init)) {
      if (set) {
        return fallack
          ? new WritableReadonlyRef<T>(init, fallack, set)
          : new WritableReadonlyRef<T | undefined>(
              init,
              fallack,
              set as (val: T | undefined) => void,
            );
      }
      return fallack
        ? new ReadonlyRef<T>(init, fallack)
        : new ReadonlyRef<T | undefined>(init, fallack);
    }
    return init ? new Ref<T>(init) : new Ref<T | undefined>(init);
  }

  makeReadonly<T>(ref: RefBase<T>) {
    return this.buildRef(ref, ref.val);
  }
}
