/* eslint-disable @typescript-eslint/no-explicit-any */
export type AnyRecord<T extends string | number | symbol = string> = Record<
  T,
  any
>;
