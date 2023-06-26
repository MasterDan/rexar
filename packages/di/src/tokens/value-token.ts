import { AnyToken, IToken } from './@types/IToken';

export class ValueToken<TValue> implements IToken<TValue> {
  constructor(private token: IToken<TValue>) {}

  provide(resolver: () => TValue): void {
    this.token.provide(resolver);
  }

  provideValue(value: TValue) {
    this.provide(() => value);
  }

  resolve(): TValue {
    return this.token.resolve();
  }
}

export function useValue<TValue>(value: TValue) {
  return (arg: AnyToken) => {
    const valueToken = new ValueToken<TValue>(arg);
    valueToken.provideValue(value);
    return valueToken;
  };
}
