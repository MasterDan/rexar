import { IToken } from './@types/IToken';
import { TokenOperator } from './@types/TokenOperator';
import { Lazy } from './lazy';

class LazyToken<T, TResolver> implements IToken<Lazy<T>, TResolver> {
  key: symbol;

  name: string;

  constructor(private token: IToken<T, TResolver>) {
    this.key = token.key;
    this.name = token.name;
  }

  provide(resolver: TResolver): void {
    this.token.provide(resolver);
  }

  resolve() {
    return new Lazy<T>(() => this.token.resolve());
  }
}

export function lazy<T, TResolve>(): TokenOperator<
  T,
  TResolve,
  Lazy<T>,
  TResolve
> {
  return (token) => new LazyToken(token);
}
