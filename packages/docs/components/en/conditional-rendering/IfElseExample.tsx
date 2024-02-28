import { defineComponent, ref, useIf, fragment, h } from '@rexar/core';

export const ifElseExample = defineComponent(() => {
  const flag$ = ref(true);
  const toggle = () => {
    flag$.value = !flag$.value;
  };
  const [[True, False]] = useIf(flag$);
  return (
    <>
      <div>
        <True>Flag is True</True>
        <False>Flag is false</False>
      </div>
      <button onClick={toggle}>Toggle flag</button>
    </>
  );
});
