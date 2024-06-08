import { Ref, Show, computed, defineComponent, ref } from '@rexar/core';
import { FadeKeys, RotateKeys, TransitionMixed } from './mixed.transition';

export const TransitionMixedExample = defineComponent(() => {
  const visible$ = ref(true);
  const rotated$ = ref(false);
  const toggle = (flag$: Ref<boolean>) => () => {
    flag$.value = !flag$.value;
  };
  const states = computed<{ fade: FadeKeys; rotate: RotateKeys }>(() => ({
    fade: visible$.value ? 'default' : 'void',
    rotate: rotated$.value ? 'rotated' : 'default',
  }));
  const flag$ = ref(true);
  return (
    <>
      <h4>Just Transition</h4>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={toggle(visible$)}>Toggle Fade</button>
        <button onClick={toggle(rotated$)}>Toggle Rotate</button>
      </div>
      <TransitionMixed states={states}>
        <div>I will fade and Rotate</div>
      </TransitionMixed>
      <h4>Transition inside Show component</h4>
      <div>
        <button onClick={toggle(flag$)}>Toggle Flag</button>
      </div>
      <Show
        when={flag$}
        content={({ waiter }) => (
          <TransitionMixed
            waiter={waiter}
            initialStates={{ fade: 'void', rotate: 'void' }}
            states={{ fade: 'default', rotate: 'rotated' }}
          >
            <div>Flag is true</div>
          </TransitionMixed>
        )}
        fallback={({ waiter }) => (
          <TransitionMixed
            waiter={waiter}
            initialStates={{ fade: 'void', rotate: 'void' }}
            states={{ fade: 'default', rotate: 'rotated' }}
          >
            <div>Flag is false</div>
          </TransitionMixed>
        )}
      />
    </>
  );
});
