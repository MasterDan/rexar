import { defineComponent, ref, computed, Show } from '@rexar/core';
import { map } from 'rxjs';

export const IfElseExampleAdvanced = defineComponent(() => {
  const counter$ = ref(0);
  const increment = () => {
    counter$.value += 1;
  };
  const isZero$ = counter$.pipe(map((c) => c === 0));
  const moreThanFive$ = computed(() => counter$.value > 5);
  return (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
      }}
    >
      <button onClick={increment}>Counter is {counter$}</button>
      <Show
        when={isZero$}
        content={() => <>Counter is zero</>}
        fallback={() => (
          <Show
            when={moreThanFive$}
            content={() => <>Counter is more than 5</>}
            fallback={() => <>Counter is less or equals 5</>}
          />
        )}
      />
    </div>
  );
});
