import { AnyComponent, Component } from '@jsx-next/@types/component';
import { JSX } from '@jsx-next/@types/jsx';
import { Lazy } from '@jsx-next/lazy';

export type ElementOrComponent = keyof JSX.IntrinsicElements | AnyComponent;

export type PropsOf<T extends ElementOrComponent> = T extends Component<
  infer TProps
>
  ? TProps
  : JSX.IntrinsicElements[Exclude<T, Component>];

function attachAttributes<T extends keyof JSX.IntrinsicElements>(
  el: HTMLElement,
  props: JSX.IntrinsicElements[T],
): T {
  if (props) {
    Object.keys(props).forEach((key) => {
      el.setAttribute(key, props[key]);
    });
  }
  return el;
}

export function createElement<T extends ElementOrComponent>(
  elementOrComponent: T,
  props?: PropsOf<T>,
  ...children: JSX.Element[]
): JSX.Element {
  const initFn = (() => {
    if (typeof elementOrComponent === 'string') {
      return () => {
        const el = document.createElement(elementOrComponent);
        if (props) {
          Object.keys(props).forEach((key) => {
            el.setAttribute(key, props[key]);
          });
          children.forEach((child) => {
            el.appendChild(child);
          });
        }
        return el;
      };
    }
    return () => elementOrComponent(props);
  })();
  return new Lazy(initFn);
}

