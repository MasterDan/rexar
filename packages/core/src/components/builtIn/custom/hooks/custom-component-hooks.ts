import { ref$ } from '@core/reactivity/ref';
import { Ref } from '@core/reactivity/ref/ref';
import { defineHook } from '@core/tools/hooks/hooks';
import {
  combineLatest,
  filter,
  fromEvent,
  map,
  merge,
  Observable,
  switchMap,
} from 'rxjs';

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

export const innerTextFor = (
  id: string,
  value$: Observable<string | undefined | null>,
) => {
  useElement(id)
    .pipe(
      filter((el): el is HTMLElement => el != null),
      switchMap((el) =>
        value$.pipe(
          filter((v): v is string => v != null),
          map((v) => ({ el, v })),
        ),
      ),
    )
    .subscribe(({ el, v }) => {
      el.innerText = v;
    });
};
