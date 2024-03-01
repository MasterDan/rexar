import { defineComponent, ref, useIf, h, computed } from '@rexar/core';
import { map } from 'rxjs';

export const IfElseExampleAdvanced = defineComponent(() => {
  const counter$ = ref(0);
  const increment = () => {
    counter$.value += 1;
  };
  const isZero$ = counter$.pipe(map((c) => c === 0));
  const moreThanFive$ = computed(() => counter$.value > 5);
  const [[IsZero], elseIf] = useIf(isZero$);
  const [[MoreThanFive, LessThanFive]] = elseIf(moreThanFive$);
  // This would also work
  // const [[MoreThanFive, LessThanFive]] = elseIf(() => counter$.value > 5);
  return (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
      }}
    >
      <button onClick={increment}>Counter is {counter$}</button>
      <IsZero>Counter is zero</IsZero>
      <LessThanFive>Counter is less or equals 5</LessThanFive>
      <MoreThanFive>Counter is more than 5</MoreThanFive>
    </div>
  );
});
