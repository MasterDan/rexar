import { defineComponent } from '@rexar/core';
import { Subject } from 'rxjs';

export const Emitter = defineComponent<{
  event$: Subject<string>;
  reset$: Subject<void>;
}>(({ event$, reset$ }) => {
  let counter = 0;
  const increment$ = new Subject<MouseEvent>();
  increment$.subscribe(() => {
    counter += 1;
    event$.next(`Event №${counter}`);
  });
  reset$.subscribe(() => {
    counter = 1;
    event$.next(`Event №${counter}`);
  });
  return (
    <>
      <button onClick={increment$}>Emit event</button>
    </>
  );
});
