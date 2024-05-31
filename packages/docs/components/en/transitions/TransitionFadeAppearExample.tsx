import { defineComponent, ref } from '@rexar/core';
import { map } from 'rxjs';
import { FadeKeys, TransitionFade } from './fade.transition';

export const TransitionFadeAppearExample = defineComponent(() => {
  const visible$ = ref(true);
  const visibleState$ = visible$.pipe(
    map((v): FadeKeys => (v ? 'default' : 'void'))
  );
  const toggle = () => {
    visible$.value = !visible$.value;
  };
  return (
    <>
      <button onClick={toggle}>Toggle visibility</button>
      <div>
        <TransitionFade initialState="void" state={visibleState$}>
          <span>I will fade</span>
        </TransitionFade>
      </div>
    </>
  );
});
