import { defineComponent, h, ref, render } from '@rexar/core';

const Counter = defineComponent(() => {
  const counter = ref(0);
  const increment = () => {
    counter.value += 1;
  };
  return (
    <div>
      <h2>Counter value is {counter}</h2>
      <button onClick={increment}>Increment count</button>
    </div>
  );
});

render(Counter).into('#counter-app');
