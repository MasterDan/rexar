import { AnyFnToken, IToken } from './@types/IToken';
import { TokenOperator } from './@types/TokenOperator';

class ValueToken<TValue> implements IToken<TValue> {
  key: symbol;

  name: string;

  constructor(private token: AnyFnToken) {
    this.key = token.key;
    this.name = token.name;
  }

  $clone(): IToken<TValue, TValue> {
    return new ValueToken(this.token.$clone());
  }

  provide(value: TValue): void {
    this.token.provide(() => value);
  }

  resolve(): TValue {
    return this.token.resolve();
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useValue<TValue, TFrom = any>(
  defaultVal?: TValue,
): TokenOperator<TFrom, () => TFrom, TValue, TValue> {
  return (arg: AnyFnToken) => {
    const valueToken: IToken<TValue> = new ValueToken<TValue>(arg);
    if (defaultVal != null) {
      valueToken.provide(defaultVal);
    }
    return valueToken;
  };
}
