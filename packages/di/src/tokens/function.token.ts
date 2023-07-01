import type { DiContainer } from '../container/di-container';
import { AnyFnToken, IToken } from './@types/IToken';
import { TokenOperator } from './@types/TokenOperator';
import { AnyAray } from './@types/AnyAray';

class FunctionToken<
  TArgs extends AnyAray,
  TResult,
  TInitialArgs extends AnyAray = TArgs,
> implements
    IToken<(...args: TInitialArgs) => TResult, (...args: TArgs) => TResult>
{
  key: symbol;

  name: string;

  constructor(
    private token: AnyFnToken,
    private fnResolve?: (
      fn: (...args: TArgs) => TResult,
    ) => (...fnargs: TInitialArgs) => TResult,
  ) {
    this.key = token.key;
    this.name = token.name;
  }

  provide(fn: (...args: TArgs) => TResult): void {
    this.token.provide(() => fn);
  }

  resolve() {
    const func = this.token.resolve() as (...args: TArgs) => TResult;
    return this.fnResolve
      ? this.fnResolve(func)
      : (func as unknown as (...args: TInitialArgs) => TResult);
  }
}

export function useFunction<
  TResult,
  TArgs extends AnyAray,
  TInitialArgs extends AnyAray = TArgs,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TFrom = any,
>(
  transformArgs?: (container: DiContainer, ...args: TInitialArgs) => TArgs,
): TokenOperator<
  TFrom,
  () => TFrom,
  (...args: TInitialArgs) => TResult,
  (...args: TArgs) => TResult
> {
  return (token, container) => {
    const func = (fn: (...args: TArgs) => TResult) =>
      transformArgs == null
        ? (...fnargs: TInitialArgs) => fn(...(fnargs as unknown as TArgs))
        : (...fnargs: TInitialArgs) => {
            const iargs = transformArgs(container, ...fnargs);
            return fn(...iargs);
          };
    return new FunctionToken<TArgs, TResult, TInitialArgs>(token, func);
    throw new Error('Not Implemented!');
  };
}
