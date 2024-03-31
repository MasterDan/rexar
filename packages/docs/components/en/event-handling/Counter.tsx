import { defineComponent, ref } from '@rexar/core';

export const Counter = defineComponent(() => {
  const counter$ = ref(0);

  return (
    <button
      onClick={() => {
        counter$.value += 1;
      }}
    >
      Counter is {counter$}
    </button>
  );
});
