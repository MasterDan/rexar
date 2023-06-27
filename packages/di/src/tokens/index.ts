import { AnyToken, IToken } from './@types/IToken';
import { TokenOperator } from './@types/TokenOperator';
import { InjectionToken } from './injection-token';

export function createToken<TValue>(name: string): IToken<TValue, () => TValue>;
export function createToken<TValue, B, BR>(
  name: string,
  op1: TokenOperator<TValue, () => TValue, B, BR>,
): IToken<B, BR>;
export function createToken<TValue, B, BR, C, CR>(
  name: string,
  op1: TokenOperator<TValue, () => TValue, B, BR>,
  op2: TokenOperator<B, BR, C, CR>,
): IToken<C, CR>;
export function createToken<TValue, B, BR, C, CR, D, DR>(
  name: string,
  op1: TokenOperator<TValue, () => TValue, B, BR>,
  op2: TokenOperator<B, BR, C, CR>,
  op3: TokenOperator<C, CR, D, DR>,
): IToken<D, DR>;
export function createToken<TValue, B, BR, C, CR, D, DR, E, ER>(
  name: string,
  op1: TokenOperator<TValue, () => TValue, B, BR>,
  op2: TokenOperator<B, BR, C, CR>,
  op3: TokenOperator<C, CR, D, DR>,
  op4: TokenOperator<D, DR, E, ER>,
): IToken<E, ER>;
export function createToken<TValue, B, BR, C, CR, D, DR, E, ER, F, FR>(
  name: string,
  op1: TokenOperator<TValue, () => TValue, B, BR>,
  op2: TokenOperator<B, BR, C, CR>,
  op3: TokenOperator<C, CR, D, DR>,
  op4: TokenOperator<D, DR, E, ER>,
  op5: TokenOperator<E, ER, F, FR>,
): IToken<F, FR>;
export function createToken<TValue, B, BR, C, CR, D, DR, E, ER, F, FR, G, GR>(
  name: string,
  op1: TokenOperator<TValue, () => TValue, B, BR>,
  op2: TokenOperator<B, BR, C, CR>,
  op3: TokenOperator<C, CR, D, DR>,
  op4: TokenOperator<D, DR, E, ER>,
  op5: TokenOperator<E, ER, F, FR>,
  op6: TokenOperator<F, FR, G, GR>,
): IToken<G, GR>;
export function createToken<
  TValue,
  B,
  BR,
  C,
  CR,
  D,
  DR,
  E,
  ER,
  F,
  FR,
  G,
  GR,
  H,
  HR,
>(
  name: string,
  op1: TokenOperator<TValue, () => TValue, B, BR>,
  op2: TokenOperator<B, BR, C, CR>,
  op3: TokenOperator<C, CR, D, DR>,
  op4: TokenOperator<D, DR, E, ER>,
  op5: TokenOperator<E, ER, F, FR>,
  op6: TokenOperator<F, FR, G, GR>,
  op7: TokenOperator<G, GR, H, HR>,
): IToken<G, GR>;
export function createToken<
  TValue,
  B,
  BR,
  C,
  CR,
  D,
  DR,
  E,
  ER,
  F,
  FR,
  G,
  GR,
  H,
  HR,
>(
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
export function createToken<TValue>(
  name: string,
  ...operators: TokenOperator[]
): AnyToken {
  const token = new InjectionToken<TValue>(name);
  return operators.length > 0 ? token.pipe(...operators) : token;
}
