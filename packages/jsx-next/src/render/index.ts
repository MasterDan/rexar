import { JSX } from '@jsx-next/@types/jsx';
import { appendChildren } from '@jsx-next/element';
import { Lazy } from '@jsx-next/lazy';

export type Unwrapped<T extends JSX.Element> = T extends JSX.ArrayElement
  ? HTMLElement[]
  : HTMLElement;

export function render<TElem extends JSX.Element>(jsxEl: TElem) {
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

export function unwrap<T extends JSX.ArrayElement>(je: T): HTMLElement[];
export function unwrap<T extends JSX.Element>(je: T): HTMLElement;
export function unwrap<T extends JSX.Element>(je: T): Unwrapped<T> {
  if (je instanceof Lazy) {
    return unwrap(je.value) as Unwrapped<T>;
  }
  if (Array.isArray(je)) {
    return je.map((i) => unwrap(i)) as Unwrapped<T>;
  }
  return je as unknown as Unwrapped<T>;
}

