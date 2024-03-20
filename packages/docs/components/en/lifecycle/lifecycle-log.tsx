import { defineComponent, fragment, h, ref, useFor, useIf } from '@rexar/core';
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
  const [[True, False]] = useIf(switcher$);
  const StatusLog = useFor(log$, (i) => i);
  return (
    <>
      <True>
        <Lifecycle name="First" onStatusChange={logStatus}></Lifecycle>
      </True>
      <False>
        <Lifecycle name="Second" onStatusChange={logStatus}></Lifecycle>
      </False>
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
