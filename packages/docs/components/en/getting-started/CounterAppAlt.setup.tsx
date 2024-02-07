import { computed, defineComponent, h, ref, render } from '@rexar/core';
import { Subject, buffer, debounceTime, filter, map } from 'rxjs';

const Counter = defineComponent(() => {
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
    <div>
      <h2>Counter * 2 is {counterX2}</h2>
      <button onClick={btnClick$}>Increment count</button>
    </div>
  );
});

render(Counter).into('#counter-app-2');
