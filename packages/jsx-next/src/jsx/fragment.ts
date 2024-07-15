import { JSX } from '@jsx-next/jsx/@types';

export function Fragment(props: { children: JSX.Element[] }) {
  return props.children;
}

