import './assets/styles/style.css';
import { defineComponent, render } from '@rexar/core';
import typescriptLogo from './assets/icons/typescript.svg';
import parcelLogo from './assets/icons/parcel-logo.png';
import rexarLogo from './assets/icons/rexar-light.png';
import tailwindLogo from './assets/icons/tailwind-css-logo.webp';
import { Counter } from './counter';

const App = defineComponent(() => (
  <div class="flex flex-col h-full items-center pt-8 gap-8">
    <div
      class="text-4xl p-4
        text-transparent 
        bg-gradient-to-r from-purple-800 to-indigo-700 
        bg-clip-text"
    >
      Parcel + TypeScript + Tailwind CSS + Rexar
    </div>

    <div class="flex p-8 gap-20 justify-around bg-neutral-50 rounded-3xl bg-opacity-25">
      <a
        href="https://parceljs.org/"
        class="transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_1.5rem_rgb(228,175,118)]"
        target="_blank"
      >
        <img src={parcelLogo} class="logo h-28 " alt="Parcel logo" />
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
      <a
        href="https://masterdan.github.io/rexar/"
        class="transition-all duration-300 hover:scale-125 hover:drop-shadow-[0_0_1.5rem_rgb(255,132,241)]"
        target="_blank"
      >
        <img src={rexarLogo} class="logo h-28 " alt="Rexar logo" />
      </a>
    </div>
    <p class="text-md">Click on logos to learn more</p>
    <Counter />
  </div>
));

render(App).into('#app');

