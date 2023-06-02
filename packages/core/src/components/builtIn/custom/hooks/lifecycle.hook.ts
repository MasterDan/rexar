import { ComponentLifecycle } from '@core/render/html/base/lifecycle';
import { defineHook } from '@core/tools/hooks/hooks';
import { filter, Observable, pairwise, take, tap } from 'rxjs';
import { BuiltInHooks } from './@types/built-in-hooks';

const lifecycleHook = defineHook<Observable<ComponentLifecycle>>(
  BuiltInHooks.Lisecycle,
);

export const onMounted = (fn: () => void) => {
  lifecycleHook((lf$) => {
    console.log('hook triggered');
    lf$.subscribe((l) => {
      console.log('subscription from hook', l);
    });
    lf$
      .pipe(
        tap((l) => {
          console.log('lifecycle is', l);
        }),
        pairwise(),
        filter(
          ([prev, curr]) =>
            curr === ComponentLifecycle.Mounted &&
            prev === ComponentLifecycle.Rendered,
        ),
        take(1),
      )
      .subscribe(fn);
  });
};

