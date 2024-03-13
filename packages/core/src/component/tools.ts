import { AnyRecord } from '@rexar/tools';
import { Providable, toObservable } from '@rexar/reactivity';
import { combineLatest, map, switchMap } from 'rxjs';

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

export type ClassName = Providable<string>;

export type ClassesValue =
  | ClassName
  | ClassName[]
  | Record<string, Providable<boolean>>;

export function useClasses<T extends ClassesValue>(arg: Providable<T>) {
  return toObservable(arg).pipe(
    switchMap((value) => {
      if (Array.isArray(value)) {
        return combineLatest(value.map((i) => toObservable(i))).pipe(
          map((classes) => classes.join(' ')),
        );
      }
      if (typeof value === 'object') {
        const valueRecord = value as Record<string, Providable<boolean>>;
        return combineLatest(
          Object.keys(valueRecord).map((key) =>
            toObservable(valueRecord[key as keyof typeof valueRecord]).pipe(
              map((apply) => ({ key, apply })),
            ),
          ),
        ).pipe(
          map((classes) =>
            classes
              .filter(({ apply }) => apply)
              .map(({ key }) => key)
              .join(' '),
          ),
        );
      }
      return toObservable(value);
    }),
  );
}
