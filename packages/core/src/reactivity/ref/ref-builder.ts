import { MaybeObservable } from '@core/@types/MaybeObservable';
import { isObservable, Observable } from 'rxjs';
import { inject, injectable } from 'tsyringe';
import { ReadonlyRef } from './readonly.ref';
import { RefBase } from './base.ref';
import { Ref } from './ref';
import { IRefBuilder } from './@types/IRefBuilder';
import { IComputedBuiler } from '../computed/@types/IComputedBuiler';

@injectable()
export class RefBuilder implements IRefBuilder {
  constructor(
    @inject('IComputedBuilder')
    private computedBuilder: IComputedBuiler,
  ) {}

  buildRef<T>(init: () => T): ReadonlyRef<T>;
  buildRef<T>(init: Observable<T>, fallack: T): ReadonlyRef<T>;
  buildRef<T>(init: Observable<T>): ReadonlyRef<T | undefined>;
  buildRef<T>(): Ref<T | undefined>;
  buildRef<T>(init: T): Ref<T>;
  buildRef<T>(init?: MaybeObservable<T> | (() => T), fallack?: T) {
    if (typeof init === 'function') {
      return this.computedBuilder.build(init as () => T);
    }

    if (isObservable(init)) {
      return fallack
        ? new ReadonlyRef<T>(init, fallack)
        : new ReadonlyRef<T | undefined>(init, fallack);
    }
    return init ? new Ref<T>(init) : new Ref<T | undefined>(init);
  }

  makeReadonly<T>(ref: RefBase<T>) {
    return this.buildRef(ref, null);
  }
}
