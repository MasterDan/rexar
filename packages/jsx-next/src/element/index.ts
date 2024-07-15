import { AnyComponent, Component } from '@jsx-next/@types/component';
import { JSX } from '@jsx-next/@types/jsx';
import { Lazy } from '@jsx-next/lazy';
import { toObservable } from '@rexar/reactivity';

export type ElementOrComponent = keyof JSX.IntrinsicElements | AnyComponent;

export type PropsOf<T extends ElementOrComponent> = T extends Component<
  infer TProps
>
  ? TProps
  : JSX.IntrinsicElements[Exclude<T, Component>];

function attachAttributes<T extends keyof JSX.IntrinsicElements>(
  el: HTMLElement,
  attrs: Partial<JSX.IntrinsicElements[T]>,
): void {
  if (!attrs) {
    return;
  }
  Object.keys(attrs).forEach((key) => {
    const value = attrs[key as keyof typeof attrs];
    if (value == null) return;
    el.setAttribute(key, String(value));
  });
}

export function appendChildren(
  el: HTMLElement,
  ...children: JSX.Element[]
): void {
  children.forEach((child) => {
    if (child instanceof Lazy) {
      const val = child.value;
      appendChildren(el, val);
    } else if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (typeof child === 'number' || typeof child === 'boolean') {
      el.appendChild(document.createTextNode(String(child)));
    } else if (Array.isArray(child)) {
      appendChildren(el, ...child);
    } else if (child instanceof Node) {
      el.appendChild(child);
    } else if (child != null) {
      const node = document.createTextNode('');
      toObservable<unknown>(child).subscribe((v) => {
        node.textContent = v == null ? '' : String(v);
      });
      el.appendChild(node);
    }
  });
}

export function createElement<T extends keyof JSX.IntrinsicElements>(
  elementOrComponent: T,
  props?: PropsOf<T>,
): Lazy<HTMLElement>;
export function createElement<T extends AnyComponent>(
  elementOrComponent: T,
  props?: PropsOf<T>,
): Lazy<ReturnType<T>>;
export function createElement<T extends ElementOrComponent>(
  elementOrComponent: T,
  props?: PropsOf<T>,
): Lazy<JSX.Element> {
  const create = (() => {
    if (typeof elementOrComponent === 'string') {
      return () => {
        const el = document.createElement(elementOrComponent);
        if (props) {
          const { children, ...attrs } = props;
          if (attrs) {
            attachAttributes(el, attrs);
          }
          if (children) {
            appendChildren(el, children);
          }
        }
        return el;
      };
    }
    return () => elementOrComponent(props);
  })();
  return new Lazy(create);
}

