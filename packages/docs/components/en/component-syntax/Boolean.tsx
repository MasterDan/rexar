import { defineComponent, ref } from '@rexar/core';

export const Boolean = defineComponent(() => {
  const bool$ = ref(true);
  return (
    <>
      <div>
        <div>reactive: {bool$}</div>
        <div>reactive: {() => (bool$.value ? 'Yes' : 'No')}</div>
        <div>non reactive: {bool$.value}</div>
      </div>
      <button
        onClick={() => {
          bool$.value = !bool$.value;
        }}
      >
        Toggle
      </button>
    </>
  );
});
