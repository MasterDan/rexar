import { defineComponent, h, fragment, ref } from '@rexar/core';
import { Subject, buffer, debounceTime, filter, map } from 'rxjs';

export const Counter = defineComponent(() => {
  const counter$ = ref(0);

  const btnClick$ = new Subject<MouseEvent>();
  const doubleClick$ = btnClick$.pipe(
    buffer(btnClick$.pipe(debounceTime(200))),
    map((list) => list.length),
    filter((len) => len === 2)
  );

  doubleClick$.subscribe(() => {
    counter$.value += 1;
  });

  return (
    <>
      <span>Counter is {counter$}</span>
      <button onClick={btnClick$}>Double click to increment</button>
    </>
  );
});
