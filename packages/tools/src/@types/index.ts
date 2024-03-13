export type AnyRecord<T extends string | number | symbol = string> = Record<
  T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
>;
