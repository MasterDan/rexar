import { AnyAray } from './AnyAray';

export type Constructor<T, TArgs extends AnyAray = AnyAray> = new (
  ...args: TArgs
) => T;
