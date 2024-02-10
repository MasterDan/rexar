import { defineComponent, h, ref } from '@rexar/core';

export const Counter = defineComponent(() => {
  const counter = ref(0);
  const increment = () => {
    counter.value += 1;
  };
  return <button onClick={increment}>Counter is {counter}</button>;
});
