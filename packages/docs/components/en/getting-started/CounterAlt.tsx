import { computed, defineComponent, h, fragment, ref } from '@rexar/core';
import { Subject, buffer, debounceTime, filter, map } from 'rxjs';

export const Counter = defineComponent(() => {
  const counter = ref(0);

  const btnClick$ = new Subject<MouseEvent>();
  btnClick$
    .pipe(
      buffer(btnClick$.pipe(debounceTime(300))),
      map((list) => list.length),
      filter((len) => len === 2),
    )
    .subscribe(() => {
      counter.value += 1;
    });

  const counterX2 = computed(() => counter.value * 2);

  return (
    <>
      <span>Counter * 2 is {counterX2}</span>
      <button onClick={btnClick$}>Double click to increment</button>
    </>
  );
});
