import './assets/styles/style.css';
import { defineComponent, render } from '@rexar/core';
import { onLocationChange } from '@rexar/router';
import typescriptLogo from './assets/icons/typescript.svg';
import viteLogo from './assets/icons/vite.svg';
import rexarLogo from './assets/icons/rexar-light.png';
import tailwindLogo from './assets/icons/tailwind-css-logo.webp';
import { Counter } from './counter';
import { TransitionTest } from './transition-test';

onLocationChange().subscribe((loc) => {
  console.log('location changed', loc);
});

const App = defineComponent(() => (
  <div class="flex flex-col h-full items-center pt-8 gap-8">
    <div
      class="text-4xl p-4
        text-transparent 
        bg-gradient-to-r from-purple-800 to-indigo-700 
        bg-clip-text"
    >
      Vite + TypeScript + Tailwind CSS + Rexar
    </div>

    <div class="bg-neutral-50 rounded-3xl bg-opacity-25">
      <div class="flex p-8 gap-20 justify-around">
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
        <a
          href="https://tailwindcss.com/"
          class="transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_1.5rem_rgb(23,189,204)]"
          target="_blank"
        >
          <img
            src={tailwindLogo}
            class="logo vanilla h-28"
            alt="TailwindCss logo"
          />
        </a>
        <div class="transition-all bg-sky-200 rounded-2xl duration-300 hover:scale-125 hover:drop-shadow-[0_0_1.5rem_rgb(255,132,241)]">
          <a href="https://masterdan.github.io/rexar/" target="_blank">
            <img
              src={rexarLogo}
              class="logo h-28 scale-110 "
              alt="Rexar logo"
            />
          </a>
        </div>
      </div>
      <div class="flex justify-center p-4">
        <p class="text-md">Click on logos to learn more</p>
      </div>
    </div>
    <Counter />
    <TransitionTest></TransitionTest>
  </div>
));

render(App).into('#app');

