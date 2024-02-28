import { defineComponent, ref, fragment, h, computed } from '@rexar/core';
import { map } from 'rxjs';

export const Numbers = defineComponent(() => {
  const number$ = ref(1);
  const numberX2Comp$ = computed(() => number$.value * 2);
  const numberX2$ = number$.pipe(map((n) => n * 2));
  return (
    <>
      <div>
        {/* Ref is Observable so it will be tracked */}
        <div>reactive: {number$}</div>
        {/* Arrow function allow us to track changes 
        ( same as in computed ) */}
        <div>reactive: {() => number$.value}</div>
        <div>reactive x2 (inPlace) : {() => number$.value * 2}</div>
        <div>reactive x2 (computed) : {numberX2Comp$}</div>
        <div>reactive x2 (observable) : {numberX2$}</div>
        {/* Accessing value is not reactive */}
        <div>non reactive: {number$.value}</div>
      </div>
      <button
        onClick={() => {
          number$.value += 1;
        }}
      >
        Increment
      </button>
    </>
  );
});
