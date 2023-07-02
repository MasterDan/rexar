import { IToken } from './@types/IToken';
import { TokenOperator } from './@types/TokenOperator';

class MultipleToken<TValue, TResolver> implements IToken<TValue[], TResolver> {
  key: symbol;

  name: string;

  private tokens: IToken<TValue, TResolver>[] = [];

  constructor(private tokenExample: IToken<TValue, TResolver>) {
    this.key = tokenExample.key;
    this.name = tokenExample.name;
  }

  $clone(): IToken<TValue[], TResolver> {
    return new MultipleToken(this.tokenExample.$clone());
  }

  provide(resolver: TResolver): void {
    const token = this.tokenExample.$clone();
    token.provide(resolver);
    this.tokens.push(token);
  }

  resolve(): TValue[] {
    return this.tokens.map((token) => token.resolve());
  }
}

export function multiple<TValue, TResolver>(): TokenOperator<
  TValue,
  TResolver,
  TValue[],
  TResolver
> {
  return (token) => new MultipleToken(token);
}
