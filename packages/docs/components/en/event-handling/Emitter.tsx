import { defineComponent, fragment, h } from '@rexar/core';

export const Emitter = defineComponent<{ onEvent: (e: string) => void }>(
  ({ onEvent }) => (
    <>
      <button
        onClick={() => {
          onEvent('Foo');
        }}
      >
        Emit "Foo"
      </button>
      <button
        onClick={() => {
          onEvent('Bar');
        }}
      >
        Emit "Bar"
      </button>
    </>
  )
);
