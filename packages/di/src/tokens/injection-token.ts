import { AnyToken, IToken } from './@types/IToken';
import { TokenOperator } from './@types/TokenOperator';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class InjectionToken<TValue = any> implements IToken<TValue> {
  key: symbol;

  name: string;

  resolver?: () => TValue;

  constructor(name = 'no-name token') {
    this.name = name;
    this.key = Symbol(name);
  }

  provide(resolver: () => TValue): void {
    this.resolver = resolver;
  }

  resolve(): TValue {
    if (this.resolver) {
      return this.resolver();
    }
    throw new Error(
      `Dependency "${this.name}" was not provided. Please, call provide method.`,
    );
  }

  pipe<TResult>(operator: TokenOperator<TValue, TResult>): IToken<TResult>;
  pipe<B, C>(
    op1: TokenOperator<TValue, B>,
    op2: TokenOperator<B, C>,
  ): IToken<C>;
  pipe<B, C, D>(
    op1: TokenOperator<TValue, B>,
    op2: TokenOperator<B, C>,
    op3: TokenOperator<C, D>,
  ): IToken<D>;
  pipe<B, C, D, E>(
    op1: TokenOperator<TValue, B>,
    op2: TokenOperator<B, C>,
    op3: TokenOperator<C, D>,
    op4: TokenOperator<D, E>,
    ...rest: TokenOperator[]
  ): IToken<E>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pipe(...operators: TokenOperator[]): AnyToken {
    return operators.reduce((t, o) => o(t), this as AnyToken) as AnyToken;
  }
}
