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
    setOrOptions?: Partial<IComputedBuilderOptions>,
  ): ReadonlyRef<T>;
  build<T>(
    fn: () => T,
    setOrOptions?: (val: T) => void,
    options?: Partial<IComputedBuilderOptions>,
  ): WritableReadonlyRef<T>;
  build<T>(
    fn: () => T,
    setOrOptions?: ((val: T) => void) | Partial<IComputedBuilderOptions>,
    options: Partial<IComputedBuilderOptions> = {},
  ): ReadonlyRef<T> | WritableReadonlyRef<T> {
    const isComptedWritable = typeof setOrOptions === 'function';
    const defaultOptions: IComputedBuilderOptions = { debounce: 0 };
    const opts = (isComptedWritable ? options : setOrOptions) ?? {};
    const { debounce } = {
      ...defaultOptions,
      ...opts,
    } as IComputedBuilderOptions;

    const contextKey = Symbol('computed');
    const innerRefs$ = this.refBuilder.buildRef<RefBase[]>([]);

    const compute = () => {
      this.context.beginScope(contextKey, (ref) => {
        innerRefs$.patch((v) => {
          v.push(ref);
        });
      });
      const resultValue = fn();

      this.context.endScope();
      return resultValue;
    };

    const result = this.refBuilder.buildRef<T>(compute());

    innerRefs$
      .pipe(
        switchMap((refs) => combineLatest(refs)),
        debounce > 0 ? debounceTime(debounce) : tap(),
      )
      .subscribe(() => {
        const newVal = compute();
        if (result.value !== newVal) {
          result.value = newVal;
        }
      });

    return isComptedWritable
      ? this.refBuilder.buildRef(result, setOrOptions, result.value)
      : this.refBuilder.makeReadonly(result);
  }
}
