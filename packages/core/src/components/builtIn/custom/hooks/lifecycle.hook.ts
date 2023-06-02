import { ComponentLifecycle } from '@core/render/html/base/lifecycle';
import { defineHook } from '@core/tools/hooks/hooks';
import { filter, Observable, pairwise } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { BuiltInHooks } from './@types/built-in-hooks';

const lifecycleHook = defineHook<Observable<ComponentLifecycle>>(
  BuiltInHooks.Lisecycle,
);

export const onMounted = (fn?: () => void) => {
  const mounted$ = new Subject<void>();
  lifecycleHook((lf$) => {
    const isMounted$ = lf$.pipe(
      pairwise(),
      filter(
        ([prev, curr]) =>
          curr === ComponentLifecycle.Mounted &&
          prev === ComponentLifecycle.Rendered,
      ),
    );
    if (fn) {
      isMounted$.subscribe(() => {
        fn();
      });
    }
    isMounted$.subscribe(() => {
      mounted$.next();
      mounted$.complete();
    });
  });
  return mounted$;
};

export const onBeforeUnmount = (fn?: () => void) => {
  const beforeUnmount$ = new Subject<void>();
  lifecycleHook((lf$) => {
    const isBeforeUnmount$ = lf$.pipe(
      pairwise(),
      filter(
        ([prev, curr]) =>
          curr === ComponentLifecycle.BeforeUnmount &&
          prev === ComponentLifecycle.Mounted,
      ),
    );
    if (fn) {
      isBeforeUnmount$.subscribe(() => {
        fn();
      });
    }
    isBeforeUnmount$.subscribe(() => {
      beforeUnmount$.next();
      beforeUnmount$.complete();
    });
  });
  return beforeUnmount$;
};

export const onUnmounted = (fn?: () => void) => {
  const unmounted$ = new Subject<void>();
  lifecycleHook((lf$) => {
    const isUnmounted$ = lf$.pipe(
      pairwise(),
      filter(
        ([prev, curr]) =>
          curr === ComponentLifecycle.Unmounted &&
          prev === ComponentLifecycle.BeforeUnmount,
      ),
    );
    if (fn) {
      isUnmounted$.subscribe(() => {
        fn();
      });
    }
    isUnmounted$.subscribe(() => {
      unmounted$.next();
      unmounted$.complete();
    });
  });
  return unmounted$;
};

