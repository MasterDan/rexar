import { AnyRecord } from '@rexar/tools';

export type NullableKeys<T> = {
  [Key in keyof T]-?: Extract<T[Key], null | undefined> extends never
    ? never
    : Key;
}[keyof T];
export type ExtractNullable<T> = {
  [Key in NullableKeys<T>]: NonNullable<T[Key]>;
};

export function useDefaultValues<
  T extends AnyRecord,
  TDefaults extends Partial<ExtractNullable<T>>,
>(props: T, defaults: TDefaults): T & TDefaults {
  return {
    ...defaults,
    ...props,
  };
}
