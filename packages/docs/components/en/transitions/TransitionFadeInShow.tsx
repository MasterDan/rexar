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
        content={() => (
          <TransitionFade
            initialState="void"
            content={() => <span>Flag is True</span>}
          />
        )}
        fallback={() => (
          <TransitionFade
            initialState="void"
            content={() => <span>Flag is False</span>}
          />
        )}
      ></Show>
      <h4>To prevent automatic disappearing use special prop</h4>
      <Show
        when={flag$}
        content={() => {
          const visible$ = ref(true);
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={() => {
                  visible$.value = !visible$.value;
                }}
              >
                Toggle visibility
              </button>
              <TransitionFade
                state={() => (visible$.value ? 'default' : 'void')}
                automaticDisappear={false}
                content={() => <span>Flag is True</span>}
              />
            </div>
          );
        }}
        fallback={() => (
          <TransitionFade
            automaticDisappear={false}
            content={() => <span>Flag is False</span>}
          />
        )}
      ></Show>
    </>
  );
});
