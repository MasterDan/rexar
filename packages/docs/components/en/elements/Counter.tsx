import { defineComponent } from '@rexar/core';

export const Counter = defineComponent(() => {
  let count = 0;
  // this is already created HTML Element
  const buttonEl = <button></button>;
  const setContent = () => {
    buttonEl.textContent = `Count is ${count}`;
  };
  setContent();
  buttonEl.addEventListener('click', () => {
    count += 1;
    setContent();
  });
  return <>{buttonEl}</>;
});
