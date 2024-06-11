import { Show, defineComponent, ref } from '@rexar/core';

import { TransitionFade } from './fade.transition';

export const TransitionFadeInShow = defineComponent(() => {
  const flag$ = ref(true);
  const toggle = () => {
    flag$.value = !flag$.value;
  };
  return (
    <>
      <button onClick={toggle}>Toggle flag</button>
      <Show
        when={flag$}
        // taking waiter
        content={({ waiter }) => (
          // and passing into our transition
          <TransitionFade waiter={waiter} initialState="void">
            <span>Flag is True</span>
          </TransitionFade>
        )}
        fallback={({ waiter }) => (
          <TransitionFade waiter={waiter} initialState="void">
            <span>Flag is False</span>
          </TransitionFade>
        )}
      />
    </>
  );
});
