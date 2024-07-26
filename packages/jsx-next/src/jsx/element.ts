import { AnyComponent, Component } from '@jsx-next/@types/component';
import { JSX, Whatever } from '@jsx-next/jsx/@types';
import { Lazy } from '@jsx-next/jsx/lazy';
import { Source, toObservable } from '@rexar/reactivity';
import { combineLatest, map, of, switchMap, withLatestFrom } from 'rxjs';

export type ElementOrComponent = keyof JSX.IntrinsicElements | AnyComponent;

export type PropsOf<T extends ElementOrComponent> = T extends Component<
  infer TProps
>
  ? TProps
  : JSX.IntrinsicElements[Exclude<T, AnyComponent>];

export type ClassAttrs = {
  class?: Source<string | undefined>;
  className?: Source<string | undefined>;
  classList?: Source<Record<string, Source<boolean>>>;
};

function setAttribute(el: HTMLElement, name: string, value?: string) {
  if (value == null) el.removeAttribute(name);
  else el.setAttribute(name, value);
}

function setStyle(
  el: HTMLElement,
  value?: Source<string | Partial<Record<string, unknown>>>,
) {
  if (value == null) {
    setAttribute(el, 'style');
    return;
  }
  const elStyle = el.style;
  toObservable(value).pipe(
    switchMap((v) =>
      typeof v === 'string'
        ? of(v)
        : Object.keys(v).map((k) =>
            toObservable(v[k]).pipe(map((sv) => ({ key: k, value: sv }))),
          ),
    ),
  );
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

function setClassName(node: HTMLElement, value?: string) {
  if (value == null) node.removeAttribute('class');
  else node.className = value;
}

function setClassAttrs(el: HTMLElement, classAttrs: ClassAttrs) {
  const { class: classAttr, className, classList } = classAttrs;
  const splitClasses = (c?: string) => c?.trim().split(/\s+/) ?? [];
  const classList$ = toObservable(classList).pipe(
    map((cl) =>
      cl
        ? Object.keys(cl).map((k) =>
            toObservable(cl[k]).pipe(
              map((show) => (show ? splitClasses(k) : null)),
            ),
          )
        : [],
    ),
    switchMap((i) => combineLatest(i)),
    map((i) =>
      i
        .filter((j): j is string[] => j != null)
        .reduce((a, b) => [...a, ...b], []),
    ),
  );
  combineLatest([classAttr, className].map((i) => toObservable(i)))
    .pipe(
      map(([f, s]) => [...splitClasses(f), ...splitClasses(s)]),
      withLatestFrom(classList$),
      map(([f, s]) => [...f, ...s].join(' ')),
      map((i) => (i.trim().length === 0 ? undefined : i)),
    )
    .subscribe((val) => {
      setClassName(el, val);
    });
}

function setAttributes<T extends keyof JSX.IntrinsicElements>(
  el: HTMLElement,
  attrs: Partial<JSX.IntrinsicElements[T]>,
): void {
  if (!attrs) {
    return;
  }
  const classAttrs: ClassAttrs = {};
  Object.keys(attrs).forEach((name) => {
    const value = attrs[name as keyof typeof attrs];
    if (name === 'style') {
      setStyle(el, value as Source<string | Partial<Record<string, unknown>>>);
    } else if (
      name === 'className' ||
      name === 'class' ||
      name === 'classList'
    ) {
      // setClassName(el, value as string);
      classAttrs[name as keyof typeof classAttrs] = value as Whatever;
    } else if (name.startsWith('on')) {
      const eventName = name.slice(2).toLowerCase();
      const eventHandler = value as unknown as EventListener;
      el.addEventListener(eventName, eventHandler);
    } else {
      setAttribute(el, name, value as string);
    }
  });
  setClassAttrs(el, classAttrs);
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

