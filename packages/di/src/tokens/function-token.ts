import { AnyFnToken, IToken } from './@types/IToken';

export class FunctionToken<TArgs extends [], TResult>
  implements IToken<(...args: TArgs) => TResult>
{
  key: symbol;

  name: string;

  constructor(private token: AnyFnToken) {
    this.key = token.key;
    this.name = token.name;
  }
  provide(resolver: (...args: TArgs) => TResult): void {
    throw new Error('Method not implemented.');
  }

  resolve(): (...args: TArgs) => TResult {
    throw new Error('Method not implemented.');
  }
}
