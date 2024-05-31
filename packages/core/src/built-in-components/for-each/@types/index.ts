import { Waiter } from '@core/built-in-components/dynamic/waiter';
import { Ref } from '@rexar/reactivity';

export type Key = string | number | symbol;

export type KeyFactory<T> = (i: T, n: number) => Key;

export type EachComponent<TItem> = (arg: {
  item: Ref<TItem>;
  index: Ref<number>;
  waiter: Waiter;
}) => JSX.Element;
