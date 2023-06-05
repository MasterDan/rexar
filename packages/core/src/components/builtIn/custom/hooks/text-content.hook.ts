import { Observable, filter, switchMap, map, takeUntil } from 'rxjs';
import { onBeforeUnmount } from './lifecycle.hook';
import { useElement } from './use-element.hook';

export const bindTextContent = (
  id: string,
  value$: Observable<string | undefined | null>,
) => {
  const beforeUnmount$ = onBeforeUnmount();
  useElement(id)
    .pipe(
      takeUntil(beforeUnmount$),
      filter((el): el is HTMLElement => el != null),
      switchMap((el) =>
        value$.pipe(
          filter((v): v is string => v != null),
          map((v) => ({ el, v })),
        ),
      ),
      takeUntil(beforeUnmount$),
    )
    .subscribe(({ el, v }) => {
      el.textContent = v;
    });
};

