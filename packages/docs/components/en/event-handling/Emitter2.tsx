import { defineComponent, fragment, h } from '@rexar/core';
import { Subject } from 'rxjs';

export const Emitter = defineComponent<{ onEvent: Subject<string> }>(
  ({ onEvent }) => {
    let counter = 0;
    return (
      <>
        <button
          onClick={() => {
            counter += 1;
            onEvent.next(`Foo (${counter})`);
          }}
        >
          Emit "Foo"
        </button>
        <button
          onClick={() => {
            counter += 1;
            onEvent.next(`Bar (${counter})`);
          }}
        >
          Emit "Bar"
        </button>
      </>
    );
  }
);
