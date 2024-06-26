import { Show, defineComponent, ref, useEvent, useFor } from '@rexar/core';
import { concatMap, delay, of } from 'rxjs';
import { Lifecycle } from './lifecycle';

export const LifecycleLog = defineComponent(() => {
  const log$ = ref<string[]>([]);
  const [statusChanged$, changeStatus] = useEvent<string>();
  statusChanged$
    .pipe(concatMap((i) => of(i).pipe(delay(200))))
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
          <Lifecycle name="First" onStatusChange={changeStatus}></Lifecycle>
        )}
        fallback={() => (
          <Lifecycle name="Second" onStatusChange={changeStatus}>
            <Lifecycle name="Nested" onStatusChange={changeStatus} />
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
