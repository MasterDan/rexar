import { Ref } from '@core/reactivity/ref/ref';
import { filter, switchMap, merge, fromEvent, map, combineLatest } from 'rxjs';
import { useElement } from './use-element.hook';

export const bindValue = (id: string, value$: Ref<string | undefined>) => {
  const elRef = useElement(id);
  const validElement$ = elRef.pipe(
    filter((v): v is HTMLInputElement => v != null),
  );

  const valueChanged$ = validElement$.pipe(
    switchMap((el) =>
      merge(
        fromEvent(el, 'change'),
        fromEvent(el, 'keydown'),
        fromEvent(el, 'paste'),
        fromEvent(el, 'input'),
      ),
    ),
    map((e) => e.target),
    filter((t): t is HTMLInputElement => t != null),
    map((t) => t.value),
    filter((v) => v !== value$.val),
  );

  valueChanged$.subscribe((val) => {
    value$.val = val;
  });

  combineLatest([validElement$, value$])
    .pipe(
      filter((arr): arr is [HTMLInputElement, string] => {
        const [el, val] = arr;
        return val != null && el.value !== val;
      }),
    )
    .subscribe(([el, v]) => {
      el.value = v;
    });
};
