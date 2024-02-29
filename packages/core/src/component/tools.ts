import { AnyRecord } from '@rexar/tools';

export type NullableKeys<T> = {
  [Key in keyof T]-?: Extract<T[Key], null | undefined> extends never
    ? never
    : Key;
}[keyof T];

export type ExtractNullable<T> = {
  [Key in NullableKeys<T>]: NonNullable<T[Key]>;
};

export type Constructors<TBody extends AnyRecord> = {
  [Key in keyof TBody]: () => TBody[Key];
};

export function useDefaultValues<
  T extends AnyRecord,
  TDefaults extends Partial<ExtractNullable<T>>,
>(props: T, defaults: Constructors<TDefaults>): T & TDefaults {
  const propsWithDefaults = { ...props };
  Object.keys(defaults).forEach((key) => {
    if (propsWithDefaults[key] == null) {
      propsWithDefaults[key as keyof T] = defaults[
        key as keyof TDefaults
      ]() as unknown as T[keyof T];
    }
  });
  return propsWithDefaults as T & TDefaults;
}
