import type { DiContainer } from '../container/di-container';
import { AnyAray } from './@types/AnyAray';
import { Constructor } from './@types/Constructor';
import { AnyFnToken, IToken } from './@types/IToken';
import { TokenOperator } from './@types/TokenOperator';

class ClassToken<T, TArgs extends AnyAray = AnyAray>
  implements IToken<T, Constructor<T, TArgs>>
{
  key: symbol;

  name: string;

  constructor(private token: AnyFnToken, private resolveArgs: () => TArgs) {
    this.name = token.name;
    this.key = token.key;
  }

  $clone(): IToken<T, Constructor<T, TArgs>> {
    return new ClassToken(this.token.$clone(), this.resolveArgs);
  }

  provide(resolver: Constructor<T, TArgs>): void {
    this.token.provide(() => resolver);
  }

  resolve(): T {
    const Ctor: Constructor<T, TArgs> = this.token.resolve();
    return new Ctor(...this.resolveArgs());
  }
}

export function useClass<T, TArgs extends AnyAray = AnyAray, TFrom = unknown>(
  resolveArgs: (container: DiContainer) => TArgs = () => [] as unknown as TArgs,
): TokenOperator<TFrom, () => TFrom, T, Constructor<T, TArgs>> {
  return (token, container) =>
    new ClassToken(token, () => resolveArgs(container));
}
