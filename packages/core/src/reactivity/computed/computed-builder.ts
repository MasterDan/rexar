import { combineLatest, debounceTime, switchMap, tap } from 'rxjs';
import { inject, injectable } from 'tsyringe';
import type { IRefBuilder } from '../ref/@types/IRefBuilder';
import type { RefBase } from '../ref/base.ref';
import type { ReadonlyRef } from '../ref/readonly.ref';
import { BindingContext } from './binding-context';
import {
  ComputedBuilderArg,
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
    options?: IComputedBuilderOptions,
  ): ReadonlyRef<T | null>;
  build<T>(
    fn: { get: () => T; set: (value: T) => void },
    options?: IComputedBuilderOptions,
  ): WritableReadonlyRef<T | null>;
  build<T>(
    arg: ComputedBuilderArg<T>,
    { debounce } = { debounce: 0 },
  ): ReadonlyRef<T | null> | WritableReadonlyRef<T | null> {
    const isComptedReadonly = typeof arg === 'function';
    const fn = isComptedReadonly ? arg : arg.get;
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
    const writable = this.refBuilder.buildRef({
      source$: result,
      set: (arg as { get: () => T; set: (value: T) => void }).set,
    });
    return this.refBuilder.makeReadonly(result);
  }
}
