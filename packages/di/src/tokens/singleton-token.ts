import { IToken } from './@types/IToken';
import { TokenOperator } from './@types/TokenOperator';

export class SingletonToken<TValue, TResolver>
  implements IToken<TValue, TResolver>
{
  key: symbol;

  name: string;

  value: TValue | undefined;

  constructor(private token: IToken<TValue, TResolver>) {
    this.key = token.key;
    this.name = token.name;
  }

  provide(resolver: TResolver): void {
    this.token.provide(resolver);
  }

  resolve(): TValue {
    if (this.value == null) {
      this.value = this.token.resolve();
    }
    return this.value;
  }
}

export function singleton<TValue, TResolver>(): TokenOperator<
  TValue,
  TResolver,
  TValue,
  TResolver
> {
  return (token) => new SingletonToken(token);
}
