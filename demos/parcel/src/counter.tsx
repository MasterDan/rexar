import { defineComponent, ref } from '@rexar/core';
import { Subject } from 'rxjs';
import { Input } from './input';

export const Counter = defineComponent(() => {
  const counter = ref(0);

  const increment$ = new Subject<MouseEvent>();
  increment$.subscribe(() => {
    counter.value += 1;
  });
  return (
    <div class="bg-neutral-50 p-8 rounded-3xl bg-opacity-30 flex flex-col gap-8 items-center">
      <div class="flex gap-8 justify-between items-center">
        <Input label="Counter is" model={counter}></Input>
        <button
          class="bg-indigo-400 hover:bg-indigo-600 active:bg-indigo-500
   text-white p-2 px-4 rounded-full transition-colors duration-200"
          onClick={increment$}
        >
          Increment
        </button>
      </div>

      <p>Counter x2 is {() => counter.value * 2}</p>
    </div>
  );
});

