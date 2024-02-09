import { defineComponent, h, ref, render } from '@rexar/core';

const Counter = defineComponent(() => {
  const counter = ref(0);
  const increment = () => {
    counter.value += 1;
  };
  return (
    <div>
      <button onClick={increment}>Counter is {counter}</button>
    </div>
  );
});

render(Counter).into('#counter-app');
