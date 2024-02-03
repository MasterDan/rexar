import { Observable, filter } from 'rxjs';
import { ComponentChild } from '../@types';

export type JsxElementOrFragment = JSX.Element | DocumentFragment;

function applyChild(target: JsxElementOrFragment, child: ComponentChild) {
  if (
    child instanceof Element ||
    child instanceof DocumentFragment ||
    child instanceof Comment
  )
    target.appendChild(child);
  else if (child instanceof Observable) {
    const node = document.createTextNode('');
    (child as Observable<string | number | boolean | null | undefined>)
      .pipe(filter((x): x is string | number | boolean => x != null))
      .subscribe((val) => {
        node.textContent = val.toString();
      });
    target.appendChild(node);
  } else if (typeof child === 'string' || typeof child === 'number') {
    target.appendChild(document.createTextNode(child.toString()));
  } else console.warn('Unknown type to append: ', child);
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
