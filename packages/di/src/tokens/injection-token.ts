import { IToken } from './@types/IToken';
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

  pipe<TResult, TMiddle, TMiddle2, TMiddle3>(
    op1: TokenOperator<TValue, TMiddle>,
    op2: TokenOperator<TMiddle, TMiddle2>,
    op3: TokenOperator<TMiddle2, TMiddle3>,
    op4: TokenOperator<TMiddle3, TResult>,
  ): IToken<TResult>;
  pipe<TResult, TMiddle, TMiddle2>(
    op1: TokenOperator<TValue, TMiddle>,
    op2: TokenOperator<TMiddle, TMiddle2>,
    op3: TokenOperator<TMiddle2, TResult>,
  ): IToken<TResult>;
  pipe<TResult, TMiddle>(
    op1: TokenOperator<TValue, TMiddle>,
    op2: TokenOperator<TMiddle, TResult>,
  ): IToken<TResult>;
  pipe<TResult>(operator: TokenOperator<TValue, TResult>): IToken<TResult>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pipe<TResult = any>(...operators: TokenOperator[]): IToken<TResult> {
    return operators.reduce(
      (t, o) => o(t),
      this as IToken<unknown>,
    ) as IToken<TResult>;
  }
}
