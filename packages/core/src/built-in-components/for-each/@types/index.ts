import { Ref } from '@rexar/reactivity';

export type Key = string | number | symbol;

export type KeyFactory<T> = (i: T, n: number) => Key;

export type EachComponent<TItem> = (arg: {
  item: Ref<TItem>;
  index: Ref<number>;
}) => JSX.Element;
