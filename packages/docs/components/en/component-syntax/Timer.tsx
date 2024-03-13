import { defineComponent, h } from '@rexar/core';
import { map, take, timer, startWith } from 'rxjs';

export const Timer = defineComponent(() => {
  const timer$ = timer(1000, 1000).pipe(
    take(10),
    map((i) => `Timer ticked ${i + 1} times`),
    startWith('Timer not ticked yet'),
  );
  return <span>{timer$}</span>;
});
