import { defineComponent, computed, toRef } from '@rexar/core';
import { BehaviorSubject, map } from 'rxjs';

export const NumbersAlt = defineComponent(() => {
  const number$ = new BehaviorSubject(1);
  // Computed tracks only Refs - so it will not be reactive here
  const numberX2Comp$ = computed(() => number$.value * 2);
  const numberX2$ = number$.pipe(map((n) => n * 2));
  // Making Ref from Observable - so it will be tracked in computed functions
  const numberRef$ = toRef(number$);
  const numberRefX2$ = computed(() => numberRef$.value * 2);
  return (
    <>
      <div>
        {/* BehaviorSubject is Observable so it will be tracked */}
        <div>reactive: {number$}</div>
        {/* Only Refs changes will be tracked in arrow functions */}
        <div>non reactive: {() => number$.value}</div>
        <div>reactive: {() => numberRef$.value}</div>
        {/* Same for computed */}
        <div>non reactive x2 (computed) : {numberX2Comp$}</div>
        <div>reactive x2 (computed) : {numberRefX2$}</div>
        {/* Raw observable still will be tracked */}
        <div>reactive x2 (observable) : {numberX2$}</div>
      </div>
      <button
        onClick={() => {
          number$.next(number$.value + 1);
        }}
      >
        Increment
      </button>
    </>
  );
});
