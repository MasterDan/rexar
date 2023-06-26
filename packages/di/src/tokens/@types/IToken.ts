export interface IToken<TValue> {
  provide(resolver: () => TValue): void;
  resolve(): TValue;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyToken = IToken<any>;
