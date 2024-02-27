import { defineComponent, fragment, h } from '@rexar/core';
import { Subject } from 'rxjs';

export const Emitter = defineComponent<{ onEvent: Subject<string> }>(
  ({ onEvent }) => {
    let counter = 0;
    const increment$ = new Subject<MouseEvent>();
    increment$.subscribe(() => {
      counter += 1;
      onEvent.next(`Event №${counter}`);
    });
    return (
      <>
        <button onClick={increment$}>Emit event</button>
      </>
    );
  }
);
