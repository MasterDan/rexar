import {
  Show,
  defineComponent,
  fragment,
  h,
  ref,
  useEvent,
  useFor,
} from '@rexar/core';
import { concatMap, delay, of } from 'rxjs';
import { Lifecycle } from './lifecycle';

/**
 * Defines a React component that demonstrates lifecycle and logging.
 *
 * Creates two Lifecycle components that toggle on a button click.
 * Logs the status changes of Lifecycle components to show nesting.
 * Renders the log with numbered, delayed entries for readability.
 */
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
