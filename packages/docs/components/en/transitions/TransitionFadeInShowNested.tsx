import { Ref, Show, defineComponent, ref } from '@rexar/core';

import { TransitionFade } from './fade.transition';

export const TransitionFadeInShowNested = defineComponent(() => {
  const flag1$ = ref(true);
  const flag2$ = ref(true);
  const toggle = (flag$: Ref<boolean>) => () => {
    flag$.value = !flag$.value;
  };
  return (
    <>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={toggle(flag1$)}>Toggle flag 1</button>
        <button onClick={toggle(flag2$)}>Toggle flag 2</button>
      </div>
      <Show
        when={flag1$}
        content={({ waiter }) => (
          <TransitionFade waiter={waiter} initialState="void">
            <span>Flag 1 is True</span>
          </TransitionFade>
        )}
        // here we are taking waiter
        fallback={({ waiter: showWaiter }) => (
          <Show
            when={flag2$}
            // and passing it into nested Show component
            waiter={showWaiter}
            content={({ waiter }) => (
              <TransitionFade waiter={waiter} initialState="void">
                <span>Flag 2 is True</span>
              </TransitionFade>
            )}
            fallback={({ waiter }) => (
              <TransitionFade waiter={waiter} initialState="void">
                <span>Flag 2 is False</span>
              </TransitionFade>
            )}
          />
        )}
      />
    </>
  );
});
