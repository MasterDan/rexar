import { EventTrigger, defineComponent, fragment, h } from '@rexar/core';
import { Observable, Subject } from 'rxjs';

export const Emitter = defineComponent<{
  onEvent: EventTrigger<string>;
  reset$: Observable<void>;
}>(({ onEvent, reset$ }) => {
  let counter = 0;
  const increment$ = new Subject<MouseEvent>();
  increment$.subscribe(() => {
    counter += 1;
    onEvent(`Event №${counter}`);
  });
  reset$.subscribe(() => {
    counter = 1;
    onEvent(`Event №${counter}`);
  });
  return (
    <>
      <button onClick={increment$}>Emit event</button>
    </>
  );
});
