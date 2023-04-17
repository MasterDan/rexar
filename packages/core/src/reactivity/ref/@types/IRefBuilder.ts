import { IComputedBuilderOptions } from '@core/reactivity/computed/@types/IComputedBuiler';
import { Observable } from 'rxjs';
import { RefBase } from '../base.ref';
import { ReadonlyRef } from '../readonly.ref';
import { Ref } from '../ref';

export interface IRefBuilder {
  buildRef<T>(init: () => T, options?: IComputedBuilderOptions): ReadonlyRef<T>;
  buildRef<T>(init: Observable<T>, fallack: T): ReadonlyRef<T>;
  buildRef<T>(init: Observable<T>): ReadonlyRef<T | undefined>;
  buildRef<T>(): Ref<T | undefined>;
  buildRef<T>(init: T): Ref<T>;
  makeReadonly<T>(ref: RefBase<T>): ReadonlyRef<T>;
}
