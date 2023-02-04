import { combineLatest, debounceTime, switchMap } from 'rxjs';
import { container } from 'tsyringe';
import { ref$ } from '../ref';
import { Ref } from '../ref/ref';
import { BindingContext } from './binding-context';

export function computed<T>(fn: () => T) {
  const context = container.resolve(BindingContext);
  const result = ref$<T | null>(null);
  const contextKey = Symbol('computed');
  const innerRefs$ = ref$<Ref[]>([]);

  const compute = () => {
    context.init(contextKey, (ref) => {
      innerRefs$.patch((v) => [...v, ref]);
    });
    const resultValue = fn();
    context.cleanContext();
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

  return result;
}
