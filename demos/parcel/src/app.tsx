import { defineComponent, h, ref, render } from '@rexar/core';

console.log('Hello world!');

const Counter = defineComponent(() => {
  const count$ = ref(0);
  const increment = () => {
    count$.value += 1;
  };
  return <button onClick={increment}>count is {count$}</button>;
});

render(Counter).into('#app');

