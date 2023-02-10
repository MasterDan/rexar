import { combineLatest, debounceTime, switchMap } from 'rxjs';
import { container, injectable, instanceCachingFactory } from 'tsyringe';
import { readonly, ref$ } from '../ref';
import { Ref } from '../ref/ref';
import { BindingContext } from './binding-context';
import { computedBuiderToken } from './computed-builer.token';

@injectable()
export class ComputedBuilder {
  constructor(private context: BindingContext) {}

  build<T>(fn: () => T) {
    const result = ref$<T | null>(null);
    const contextKey = Symbol('computed');
    const innerRefs$ = ref$<Ref[]>([]);

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

    return readonly(result);
  }
}

export function registerComputedBuilder() {
  container.register<ComputedBuilder>(computedBuiderToken, {
    useFactory: instanceCachingFactory<ComputedBuilder>((c) =>
      c.resolve(ComputedBuilder),
    ),
  });
}
