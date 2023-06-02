import { ref$ } from '@core/reactivity/ref';
import { Ref } from '@core/reactivity/ref/ref';
import {
  filter,
  switchMap,
  merge,
  fromEvent,
  map,
  combineLatest,
  takeUntil,
} from 'rxjs';
import { onBeforeUnmount } from './lifecycle.hook';
import { useElement } from './use-element.hook';

export const bindStringValue = (
  id: string,
  value$: Ref<string | undefined> | Ref<string>,
) => {
  const elRef = useElement(id);
  const validElement$ = elRef.pipe(
    filter((v): v is HTMLInputElement => v != null),
  );

  const beforeUnmount$ = onBeforeUnmount();

  const valueChanged$ = validElement$.pipe(
    takeUntil(beforeUnmount$),
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
    filter((v) => v !== value$.value),
    takeUntil(beforeUnmount$),
  );

  valueChanged$.subscribe((val) => {
    value$.value = val;
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

export const bindNumericValue = (
  id: string,
  value$: Ref<number | undefined> | Ref<number>,
) => {
  const stringified$ = ref$<string | undefined>(String(value$.value));

  const reverseNumber$ = ref$(() => {
    const num = Number(stringified$.value);

    return Number.isNaN(num) ? undefined : num;
  });

  (value$ as Ref<number | undefined>)
    .pipe(filter((v) => v !== reverseNumber$.value))
    .subscribe((v) => {
      stringified$.value = String(v);
    });
  reverseNumber$.pipe(filter((rn) => rn !== value$.value)).subscribe((rn) => {
    value$.value = rn;
  });
  bindStringValue(id, stringified$);
};

export const bindBooleanValue = (id: string, value$: Ref<boolean>) => {
  const elRef = useElement(id);
  const validElement$ = elRef.pipe(
    filter((v): v is HTMLInputElement => v != null),
  );

  const valueChanged$ = validElement$.pipe(
    switchMap((el) => merge(fromEvent(el, 'change'))),
    map((e) => e.target),
    filter((t): t is HTMLInputElement => t != null),
    map((t) => t.checked),
    filter((v) => v !== value$.value),
  );

  valueChanged$.subscribe((val) => {
    value$.value = val;
  });

  combineLatest([validElement$, value$])
    .pipe(
      filter((arr): arr is [HTMLInputElement, boolean] => {
        const [el, val] = arr;
        return val != null && el.checked !== val;
      }),
    )
    .subscribe(([el, v]) => {
      el.checked = v;
    });
};
