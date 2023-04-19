import { ref$ } from '@core/reactivity/ref';
import { Ref } from '@core/reactivity/ref/ref';
import { defineHook } from '@core/tools/hooks/hooks';
import { combineLatest, filter, fromEvent, map, switchMap } from 'rxjs';

export const onMounted = defineHook('mounted');

const referenceHook = defineHook<HTMLElement>('reference');

export const useElement = (id: string) => {
  const elRef = ref$<HTMLElement>();
  referenceHook(
    (el) => {
      elRef.val = el;
    },
    {
      id,
    },
  );
  return elRef;
};

export const bindValue = (id: string, value$: Ref<string | undefined>) => {
  const elRef = ref$<HTMLInputElement>();
  referenceHook(
    (el) => {
      elRef.val = el as HTMLInputElement;
    },
    {
      id,
    },
  );
  const validElement$ = elRef.pipe(
    filter((v): v is HTMLInputElement => v != null),
  );

  const valueChanged$ = validElement$.pipe(
    switchMap((el) => fromEvent(el, 'change')),
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
