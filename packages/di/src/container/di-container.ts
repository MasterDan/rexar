import { AnyToken, IToken } from '../tokens/@types/IToken';
import { TokenOperator } from '../tokens/@types/TokenOperator';
import { InjectionToken } from '../tokens/injection-token';

export class DiContainer {
  tokens: Record<symbol, AnyToken | undefined> = {};

  createToken<TValue>(name: string): IToken<TValue, () => TValue>;
  createToken<TValue, B, BR>(
    name: string,
    op1: TokenOperator<TValue, () => TValue, B, BR>,
  ): IToken<B, BR>;
  createToken<TValue, B, BR, C, CR>(
    name: string,
    op1: TokenOperator<TValue, () => TValue, B, BR>,
    op2: TokenOperator<B, BR, C, CR>,
  ): IToken<C, CR>;
  createToken<TValue, B, BR, C, CR, D, DR>(
    name: string,
    op1: TokenOperator<TValue, () => TValue, B, BR>,
    op2: TokenOperator<B, BR, C, CR>,
    op3: TokenOperator<C, CR, D, DR>,
  ): IToken<D, DR>;
  createToken<TValue, B, BR, C, CR, D, DR, E, ER>(
    name: string,
    op1: TokenOperator<TValue, () => TValue, B, BR>,
    op2: TokenOperator<B, BR, C, CR>,
    op3: TokenOperator<C, CR, D, DR>,
    op4: TokenOperator<D, DR, E, ER>,
  ): IToken<E, ER>;
  createToken<TValue, B, BR, C, CR, D, DR, E, ER, F, FR>(
    name: string,
    op1: TokenOperator<TValue, () => TValue, B, BR>,
    op2: TokenOperator<B, BR, C, CR>,
    op3: TokenOperator<C, CR, D, DR>,
    op4: TokenOperator<D, DR, E, ER>,
    op5: TokenOperator<E, ER, F, FR>,
  ): IToken<F, FR>;
  createToken<TValue, B, BR, C, CR, D, DR, E, ER, F, FR, G, GR>(
    name: string,
    op1: TokenOperator<TValue, () => TValue, B, BR>,
    op2: TokenOperator<B, BR, C, CR>,
    op3: TokenOperator<C, CR, D, DR>,
    op4: TokenOperator<D, DR, E, ER>,
    op5: TokenOperator<E, ER, F, FR>,
    op6: TokenOperator<F, FR, G, GR>,
  ): IToken<G, GR>;
  createToken<TValue, B, BR, C, CR, D, DR, E, ER, F, FR, G, GR, H, HR>(
    name: string,
    op1: TokenOperator<TValue, () => TValue, B, BR>,
    op2: TokenOperator<B, BR, C, CR>,
    op3: TokenOperator<C, CR, D, DR>,
    op4: TokenOperator<D, DR, E, ER>,
    op5: TokenOperator<E, ER, F, FR>,
    op6: TokenOperator<F, FR, G, GR>,
    op7: TokenOperator<G, GR, H, HR>,
  ): IToken<G, GR>;
  createToken<TValue, B, BR, C, CR, D, DR, E, ER, F, FR, G, GR, H, HR>(
    name: string,
    op1: TokenOperator<TValue, () => TValue, B, BR>,
    op2: TokenOperator<B, BR, C, CR>,
    op3: TokenOperator<C, CR, D, DR>,
    op4: TokenOperator<D, DR, E, ER>,
    op5: TokenOperator<E, ER, F, FR>,
    op6: TokenOperator<F, FR, G, GR>,
    op7: TokenOperator<G, GR, H, HR>,
    ...rest: TokenOperator[]
  ): AnyToken;
  createToken<TValue>(name: string, ...operators: TokenOperator[]): AnyToken {
    const token = new InjectionToken<TValue>(name);
    const finalToken = operators.length > 0 ? token.pipe(...operators) : token;
    this.tokens[finalToken.key] = finalToken;
    return finalToken;
  }

  resolve<TValue>(key: string | symbol) {
    if (typeof key === 'string') {
      const token = Object.values<IToken<TValue>>(this.tokens).find(
        (t) => t.name === key,
      );
      if (token != null) {
        return token.resolve();
      }
      throw new Error('Cannot resolve depandency');
    } else {
      const token = this.tokens[key];
      if (token) {
        token.resolve() as TValue;
      }
      throw new Error('Cannot resolve depandency');
    }
  }
}
