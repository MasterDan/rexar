import { IToken } from './@types/IToken';
import { TokenOperator } from './@types/TokenOperator';
import { InjectionToken } from './injection-token';

export function createToken<TValue>(
  name?: string,
  ...operators: TokenOperator[]
) {
  const token = new InjectionToken(name);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let resultToken: IToken<any> = token;
  if (operators.length > 0) {
    resultToken = token.pipe(operators);
  }
}
