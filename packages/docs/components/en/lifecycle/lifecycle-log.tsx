import { Show, defineComponent, fragment, h, ref, useFor } from '@rexar/core';
import { Lifecycle } from './lifecycle';

export const LifecycleLog = defineComponent(() => {
  const log$ = ref<string[]>([]);
  const logStatus = (message: string) => {
    log$.value.push(message);
  };
  const switcher$ = ref(true);
  const toggle = () => {
    switcher$.value = !switcher$.value;
  };

  const StatusLog = useFor(log$, (i) => i);
  return (
    <>
      <Show
        when={switcher$}
        content={() => (
          <Lifecycle name="First" onStatusChange={logStatus}></Lifecycle>
        )}
        fallback={() => (
          <Lifecycle name="Second" onStatusChange={logStatus}></Lifecycle>
        )}
      ></Show>
      <button onClick={toggle}>Toggle Components</button>
      <div>
        <StatusLog
          each={({ item, index }) => (
            <div>
              {() => index.value + 1}: {item}
            </div>
          )}
        ></StatusLog>
      </div>
    </>
  );
});
