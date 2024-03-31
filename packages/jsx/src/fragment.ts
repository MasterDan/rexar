import { BaseProps } from '@jsx/@types';
import { applyChildren } from '@jsx/dom-manipulation/children';

export function Fragment(props: BaseProps) {
  const df = document.createDocumentFragment();
  if (props.children) applyChildren(df, [props.children]);
  return df;
}

