import { IComputedBuilderOptions } from '@reactivity/computed/@types/IComputedBuilder';
import { Observable } from 'rxjs';
import { RefBase } from '../base.ref';
import { ReadonlyRef } from '../readonly.ref';
import { WritableReadonlyRef } from '../readonly.ref.writable';
import { Ref } from '../ref';

export interface IRefBuilder {
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
  buildRef<T>(init: Observable<T>): ReadonlyRef<T | undefined>;
  buildRef<T>(init: Observable<T>, fallack: T): ReadonlyRef<T>;
  buildRef<T>(): Ref<T | undefined>;
  buildRef<T>(init: T): Ref<T>;
  makeReadonly<T>(ref: RefBase<T>): ReadonlyRef<T>;
}
