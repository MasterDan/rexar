import { ComponentLifecycle } from '@core/render/html/base/lifecycle';
import { defineHook } from '@core/tools/hooks/hooks';
import { filter, Observable, pairwise } from 'rxjs';
import { BuiltInHooks } from './@types/built-in-hooks';

const lifecycleHook = defineHook<Observable<ComponentLifecycle>>(
  BuiltInHooks.Lisecycle,
);

export const onMounted = (fn?: () => void) => {
  lifecycleHook((lf$) => {
    const mounted$ = lf$.pipe(
      pairwise(),
      filter(
        ([prev, curr]) =>
          curr === ComponentLifecycle.Mounted &&
          prev === ComponentLifecycle.Rendered,
      ),
    );
    if (fn) {
      mounted$.subscribe(() => {
        fn();
      });
    }
    return mounted$;
  });
};

export const onBeforeUnmount = (fn?: () => void) => {
  lifecycleHook((lf$) => {
    const beforeUnmount$ = lf$.pipe(
      pairwise(),
      filter(
        ([prev, curr]) =>
          curr === ComponentLifecycle.BeforeUnmount &&
          prev === ComponentLifecycle.Mounted,
      ),
    );
    if (fn) {
      beforeUnmount$.subscribe(() => {
        fn();
      });
    }
    return beforeUnmount$;
  });
};

export const onUnmounted = (fn?: () => void) => {
  lifecycleHook((lf$) => {
    const unmounted$ = lf$.pipe(
      pairwise(),
      filter(
        ([prev, curr]) =>
          curr === ComponentLifecycle.Unmounted &&
          prev === ComponentLifecycle.BeforeUnmount,
      ),
    );
    if (fn) {
      unmounted$.subscribe(() => {
        fn();
      });
    }
    return unmounted$;
  });
};

