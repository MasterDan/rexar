import { RenderFunction, BaseProps, ComponentAttributes } from './@types';
import { createDomElement } from './dom-manipulation/create-dom-element';
import { setAttributes } from './dom-manipulation/set-attributes';
import { applyChildren } from './dom-manipulation/children';
import { Fragment } from './fragment';

export function jsx<TProps extends BaseProps & ComponentAttributes>(
  tag: string | RenderFunction,
  props: TProps,
): JSX.Element {
  if (typeof tag === 'function') return tag(props);

  const { children, ...attrs } = props;
  const element = createDomElement(tag, attrs);

  if (attrs) setAttributes(element, attrs);

  applyChildren(element, [children]);
  return element;
}

export { jsx as jsxs, jsx as jsxDEV, Fragment };
