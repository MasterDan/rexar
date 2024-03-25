import { defineComponent, fragment, h } from '@rexar/core';

export const Emitter = defineComponent<{
  onEvent: (e: string) => void;
}>(({ onEvent }) => {
  const emitFoo = () => {
    onEvent('Foo');
  };
  return (
    <>
      <button onClick={emitFoo}>Emit "Foo"</button>
      <button
        onClick={() => {
          onEvent('Bar');
        }}
      >
        Emit "Bar"
      </button>
    </>
  );
});
