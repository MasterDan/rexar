import { Observable, filter, switchMap, map } from 'rxjs';
import { useElement } from './use-element.hook';

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
