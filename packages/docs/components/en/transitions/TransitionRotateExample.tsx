import { computed, defineComponent, ref } from '@rexar/core';
import { RotateKeys, TransitionRotate } from './rotate.transition';

export const TransitionRotateExample = defineComponent(() => {
  const rotated$ = ref(false);
  const toggleRotate = () => {
    rotated$.value = !rotated$.value;
  };
  const state$ = computed<RotateKeys>(() =>
    rotated$.value ? 'rotated' : 'default'
  );
  return (
    <>
      <button onClick={toggleRotate}>
        {() => (rotated$.value ? 'back to default' : 'rotate me')}
      </button>
      <TransitionRotate state={state$}>
        <div>I will rotate</div>
      </TransitionRotate>
    </>
  );
});
