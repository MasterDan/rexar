import { createProvider, onBeforeDestroy } from '@core/scope';
import { Ref } from '@rexar/reactivity';
import { Subject, take, takeUntil } from 'rxjs';

export type WaitContext = {
  waitForMe$: Ref<boolean>;
  done$: Subject<void>;
  imWaiting$: Subject<void>;
};

export const waitingProvider = createProvider<WaitContext | null>();

export function onWaiting(handler: (done: () => void) => void) {
  const context = waitingProvider.inject();
  const beforeDestroy$ = onBeforeDestroy();

  if (context != null) {
    waitingProvider.provide(null);
    context.waitForMe$.value = true;
    const done = () => {
      context.waitForMe$.value = false;
      context.done$.next();
    };
    context.imWaiting$
      .pipe(takeUntil(beforeDestroy$), take(1))
      .subscribe(() => {
        handler(done);
      });
  }
}

