import {
  BaseProps,
  RenderFunction,
  ComponentAttributes,
  ComponentChild,
} from './@types';
import { createDomElement } from './dom-manipulation/create-dom-element';
import { setAttributes } from './dom-manipulation/set-attributes';
import { applyChildren } from './dom-manipulation/children';

export function createElement(
  tag: string | RenderFunction,
  attrs: null | ComponentAttributes,
  ...children: ComponentChild[]
): JSX.Element {
  if (typeof tag === 'function') return tag({ ...attrs, children });

  const element = createDomElement(tag, attrs);

  if (attrs) setAttributes(element, attrs as ComponentAttributes);

  applyChildren(element, children);
  return element;
}

export const h = createElement;

export function fragment(props: BaseProps) {
  const df = document.createDocumentFragment();
  if (props.children) applyChildren(df, [props.children]);
  return df;
}
