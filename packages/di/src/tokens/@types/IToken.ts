export interface IToken<TValue, TResolver = TValue> {
  key: symbol;
  name: string;
  provide(resolver: TResolver): void;
  resolve(): TValue;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyToken = IToken<any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFnToken = IToken<any, () => any>;
