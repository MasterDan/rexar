import { combineLatest, debounceTime, switchMap, tap } from 'rxjs';
import { inject, injectable } from 'tsyringe';
import type { IRefBuilder } from '../ref/@types/IRefBuilder';
import type { RefBase } from '../ref/base.ref';
import type { ReadonlyRef } from '../ref/readonly.ref';
import { BindingContext } from './binding-context';
import {
  IComputedBuilderOptions,
  IComputedBuiler,
} from './@types/IComputedBuiler';
import { WritableReadonlyRef } from '../ref/readonly.ref.writable';

@injectable()
export class ComputedBuilder implements IComputedBuiler {
  constructor(
    private context: BindingContext,
    @inject('IRefBuilder') private refBuilder: IRefBuilder,
  ) {}

  build<T>(
    fn: () => T,
    setOrOptions?: IComputedBuilderOptions,
  ): ReadonlyRef<T | null>;
  build<T>(
    fn: () => T,
    setOrOptions?: (val: T) => void,
    options?: IComputedBuilderOptions,
  ): WritableReadonlyRef<T | null>;
  build<T>(
    fn: () => T,
    setOrOptions?: ((val: T) => void) | IComputedBuilderOptions,
    options?: IComputedBuilderOptions,
  ): ReadonlyRef<T | null> | WritableReadonlyRef<T | null> {
    const isComptedReadonly = typeof setOrOptions === 'function';
    const result = this.refBuilder.buildRef<T | null>(null);
    const contextKey = Symbol('computed');
    const innerRefs$ = this.refBuilder.buildRef<RefBase[]>([]);

    const compute = () => {
      this.context.init(contextKey, (ref) => {
        innerRefs$.patch((v) => [...v, ref]);
      });
      const resultValue = fn();
      this.context.cleanContext();
      return resultValue;
    };

    result.val = compute();

    innerRefs$
      .pipe(
        switchMap((refs) => combineLatest(refs)),
        debounce > 0 ? debounceTime(debounce) : tap(),
      )
      .subscribe(() => {
        result.val = compute();
      });

    return this.refBuilder.makeReadonly(result);
  }
}
