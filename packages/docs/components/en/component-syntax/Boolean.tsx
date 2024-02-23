import { defineComponent, ref, fragment, h } from '@rexar/core';

export const Boolean = defineComponent(() => {
  const bool = ref(true);
  return (
    <>
      <div>
        <h3>Booleans</h3>
        <div>reactive: {bool}</div>
        <div>reactive: {() => (bool.value ? 'Yes' : 'No')}</div>
        <div>non reactive: {bool.value}</div>
      </div>
      <button
        onClick={() => {
          bool.value = !bool.value;
        }}
      >
        Toggle
      </button>
    </>
  );
});
