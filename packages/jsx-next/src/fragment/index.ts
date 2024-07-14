import { JSX } from '@jsx-next/@types/jsx';

export function Fragment(props: { children: JSX.Element[] }) {
  return props.children;
}

