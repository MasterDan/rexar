import { defineComponent, ref } from '@rexar/core';
import { map } from 'rxjs';
import { FadeKeys, TransitionFade } from './transitions';

export const TransitionFadeExample = defineComponent(() => {
  const visible$ = ref(true);
  const visibleState$ = visible$.pipe(
    map((v): FadeKeys => (v ? 'default' : 'void'))
  );
  return (
    <>
      <button
        onClick={() => {
          visible$.value = !visible$.value;
        }}
      >
        Toggle visibility
      </button>
      <div>
        <TransitionFade state={visibleState$}>
          <span>I will fade</span>
        </TransitionFade>
      </div>
    </>
  );
});
