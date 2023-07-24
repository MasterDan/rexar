import type { DiContainer } from '../container/di-container';
import { AnyToken, IToken } from './@types/IToken';
import { TokenOperator } from './@types/TokenOperator';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class InjectionToken<TValue = any>
  implements IToken<TValue, () => TValue>
{
  key: symbol;

  name: string;

  resolver?: () => TValue;

  constructor(name = 'no-name token') {
    this.name = name;
    this.key = Symbol(name);
  }

  $clone(): IToken<TValue, () => TValue> {
    return new InjectionToken(this.name);
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

  pipe(container: DiContainer, ...operators: TokenOperator[]): AnyToken {
    return operators.reduce(
      (t, o) => o(t, container),
      this as AnyToken,
    ) as AnyToken;
  }
}