import { combineLatest, debounceTime, switchMap } from 'rxjs';
import { inject, injectable } from 'tsyringe';
import type { IRefBuilder } from '../ref/@types/IRefBuilder';
import type { RefBase } from '../ref/base.ref';
import type { ReadonlyRef } from '../ref/readonly.ref';
import { BindingContext } from './binding-context';
import { IComputedBuiler } from './@types/IComputedBuiler';

@injectable()
export class ComputedBuilder implements IComputedBuiler {
  constructor(
    private context: BindingContext,
    @inject('IRefBuilder') private refBuilder: IRefBuilder,
  ) {}

  build<T>(fn: () => T): ReadonlyRef<T | null> {
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
        debounceTime(16),
      )
      .subscribe(() => {
        result.val = compute();
      });

    return this.refBuilder.makeReadonly(result);
  }
}
