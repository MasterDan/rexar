import { toObservable } from '@rexar/reactivity';
import { ComponentChild } from '@jsx/@types';

export type JsxElementOrFragment = JSX.Element | DocumentFragment;

function applyChild(
  target: JsxElementOrFragment,
  child: Exclude<ComponentChild, ComponentChild[]>,
) {
  if (
    child instanceof Element ||
    child instanceof DocumentFragment ||
    child instanceof Comment
  )
    target.appendChild(child);
  else if (typeof child === 'string' || typeof child === 'number') {
    target.appendChild(document.createTextNode(child.toString()));
  } else {
    const node = document.createTextNode('');
    toObservable(child).subscribe((val) => {
      if (val == null) {
        return;
      }
      node.textContent = val.toString();
    });
    target.appendChild(node);
  }
}

export function applyChildren(
  target: JsxElementOrFragment,
  children: ComponentChild[],
) {
  children
    .filter((child): child is NonNullable<typeof child> => child != null)
    .forEach((child) => {
      if (Array.isArray(child)) {
        applyChildren(target, child);
      } else {
        applyChild(target, child);
      }
    });
}
