import './style.css';
import {
  h,
  defineComponent,
  render,
  ref,
  toRef,
  computed,
  useIf,
} from '@rexar/core';
import { Subject, debounceTime, filter } from 'rxjs';
import typescriptLogo from './typescript.svg';
// eslint-disable-next-line import/no-absolute-path
import viteLogo from '/vite.svg';
import { CatsApp } from './cats';
import { Input } from './input';

const App = defineComponent(() => {
  const message = ref('Hello from Ref');
  const counter = ref(1);
  const evenCounter = toRef(counter.pipe(filter((c) => c % 2 === 0)));
  const oddCounter = toRef(counter.pipe(filter((c) => c % 2 !== 0)));
  const [[EvenCounterExists, NoEvenCounter]] = useIf(
    computed(() => evenCounter.value != null),
  );
  const [[OddCounterExists, NoOddCounter]] = useIf(
    computed(() => oddCounter.value != null),
  );
  const x2Counter = computed(() => counter.value * 2);

  const increment$ = new Subject<MouseEvent>();
  increment$.pipe(debounceTime(200)).subscribe(() => {
    counter.value += 1;
  });

  return (
    <div class="flex flex-col items-center pt-8 gap-8">
      <div
        class="text-4xl p-4
        text-transparent 
        bg-gradient-to-r from-purple-800 to-indigo-700 
        bg-clip-text"
      >
        Vite + TypeScript
      </div>

      <div class="flex p-8 gap-20 justify-around bg-neutral-50 rounded-3xl bg-opacity-25">
        <a
          href="https://vitejs.dev"
          class="transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_1.5rem_rgb(169,78,254)]"
          target="_blank"
        >
          <img src={viteLogo} class="logo h-28 " alt="Vite logo" />
        </a>
        <a
          href="https://www.typescriptlang.org/"
          class="transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_1.5rem_rgb(0,122,204)]"
          target="_blank"
        >
          <img
            src={typescriptLogo}
            class="logo vanilla h-28"
            alt="TypeScript logo"
          />
        </a>
      </div>
      <p class="text-md">
        Click on the Vite and TypeScript logos to learn more
      </p>
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
        <EvenCounterExists>
          <p>Last even counter is {evenCounter} </p>
        </EvenCounterExists>
        <NoEvenCounter>
          <p>Counter never been even</p>
        </NoEvenCounter>
        <OddCounterExists>
          <p>Last odd counter is {oddCounter} </p>
        </OddCounterExists>
        <NoOddCounter>
          <p>Counter never been odd</p>
        </NoOddCounter>
        <p>Counter x2 is {x2Counter}</p>
      </div>

      <p>{message}</p>
    </div>
  );
});

render(App).into('#app');
render(CatsApp).into('#cats');

