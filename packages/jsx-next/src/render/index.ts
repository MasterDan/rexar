import { JSX } from '@jsx-next/@types/jsx';
import { appendChildren } from '@jsx-next/element';

export function render(jsxEl: JSX.Element) {
  const findElement = (elOrSelector: string | Element): HTMLElement => {
    if (typeof elOrSelector === 'string') {
      const el = document.querySelector(elOrSelector);
      if (el == null) {
        throw new Error('Could not find element');
      }
      return el as HTMLElement;
    }
    return elOrSelector as HTMLElement;
  };
  const into = (elOrSelector: string | Element) => {
    const el = findElement(elOrSelector);
    appendChildren(el, jsxEl);
    return el;
  };
  return { into };
}

