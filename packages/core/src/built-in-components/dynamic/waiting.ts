import { createProvider } from '@core/scope';
import { Ref } from '@rexar/reactivity';
import { Subject, take } from 'rxjs';

export type WaitContext = {
  waitForMe$: Ref<boolean>;
  done$: Subject<void>;
  imWaiting$: Subject<void>;
};

export const waitingProvider = createProvider<WaitContext | null>();

export function onWaiting(handler: (done: () => void) => void) {
  const context = waitingProvider.inject();

  if (context != null) {
    waitingProvider.provide(null);
    context.waitForMe$.value = true;
    const done = () => {
      context.waitForMe$.value = false;
      context.done$.next();
    };
    context.imWaiting$.pipe(take(1)).subscribe(() => {
      handler(done);
    });
  }
}

