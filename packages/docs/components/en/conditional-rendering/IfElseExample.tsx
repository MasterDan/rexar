import { defineComponent, ref, Show } from '@rexar/core';

export const ifElseExample = defineComponent(() => {
  const flag$ = ref(true);
  const toggle = () => {
    flag$.value = !flag$.value;
  };
  return (
    <>
      <div>
        <Show
          when={flag$}
          content={() => <>Flag is True</>}
          fallback={() => <>Flag is false</>}
        ></Show>
      </div>
      <button onClick={toggle}>Toggle flag</button>
    </>
  );
});
