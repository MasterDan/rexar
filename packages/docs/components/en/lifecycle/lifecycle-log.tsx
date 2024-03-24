import { Show, defineComponent, fragment, h, ref, useFor } from '@rexar/core';
import { Subject, concatMap, delay, of } from 'rxjs';
import { Lifecycle } from './lifecycle';

export const LifecycleLog = defineComponent(() => {
  const log$ = ref<string[]>([]);
  const logStatus$ = new Subject<string>();
  logStatus$
    .pipe(concatMap((i) => of(i).pipe(delay(400))))
    .subscribe((status) => {
      log$.value.push(status);
    });

  const switcher$ = ref(true);
  const toggle = () => {
    log$.value = [];
    switcher$.value = !switcher$.value;
  };

  const StatusLog = useFor(log$, (i) => i);
  return (
    <>
      <Show
        when={switcher$}
        content={() => (
          <Lifecycle name="First" statusChanged$={logStatus$}></Lifecycle>
        )}
        fallback={() => (
          <Lifecycle name="Second" statusChanged$={logStatus$}>
            <Lifecycle name="Nested" statusChanged$={logStatus$} />
          </Lifecycle>
        )}
      />
      <button onClick={toggle}>Toggle Components</button>
      <div>
        <StatusLog
          each={({ item, index }) => (
            <div>
              {() => index.value + 1}: {item}
            </div>
          )}
        />
      </div>
    </>
  );
});
