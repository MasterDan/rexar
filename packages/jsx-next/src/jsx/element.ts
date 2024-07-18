import { AnyComponent, Component } from '@jsx-next/@types/component';
import { JSX } from '@jsx-next/jsx/@types';
import { Lazy } from '@jsx-next/jsx/lazy';
import { Source, toObservable } from '@rexar/reactivity';

export type ElementOrComponent = keyof JSX.IntrinsicElements | AnyComponent;

export type PropsOf<T extends ElementOrComponent> = T extends Component<
  infer TProps
>
  ? TProps
  : JSX.IntrinsicElements[Exclude<T, Component>];

function setAttribute(el: HTMLElement, name: string, value?: string) {
  if (value == null) el.removeAttribute(name);
  else el.setAttribute(name, value);
}

function setStyle(
  el: HTMLElement,
  value?: string | Partial<Record<string, unknown>>,
) {
  if (value == null) {
    setAttribute(el, 'style');
    return;
  }
  const elStyle = el.style;
  if (typeof value === 'string') {
    elStyle.cssText = value;
  }
  if (typeof value === 'string') {
    elStyle.cssText = value;
  } else if (typeof value === 'object') {
    Object.keys(value).forEach((key) => {
      const v = value[key as keyof typeof value];
      if (v == null) {
        elStyle.removeProperty(key);
      } else {
        elStyle.setProperty(key, String(v));
      }
    });
  }
}

function setClassList(
  el: HTMLElement,
  value: Partial<Record<string, Source<boolean>>> = {},
) {
  Object.keys(value).forEach((classes) => {
    const val = value[classes as keyof typeof value];
    const classNames = classes.trim().split(/\s+/);
    if (val == null) {
      classNames.forEach((className) => el.classList.remove(className));
    } else {
      toObservable(val).subscribe((v) => {
        if (v) {
          classNames.forEach((className) => el.classList.add(className));
        } else {
          classNames.forEach((className) => el.classList.remove(className));
        }
      });
    }
  });
}

function assignAttribute(el: HTMLElement, name: string, value?: unknown): void {
  if (value == null) return;
  if (name === 'style') {
    setStyle(el, value);
  } else if (name === 'classList') {
    setClassList(el, value);
  } else if (name === 'className') {
    el.className = value as string;
  } else if (name.startsWith('on')) {
    const eventName = name.slice(2).toLowerCase();
    const eventHandler = value as unknown as EventListener;
    el.addEventListener(eventName, eventHandler);
  } else {
    setAttribute(el, name, value as string);
  }
}

function setAttributes<T extends keyof JSX.IntrinsicElements>(
  el: HTMLElement,
  attrs: Partial<JSX.IntrinsicElements[T]>,
): void {
  if (!attrs) {
    return;
  }
  Object.keys(attrs).forEach((key) => {
    const value = attrs[key as keyof typeof attrs];
    assignAttribute(el, key, value);
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
            setAttributes(el, attrs);
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

