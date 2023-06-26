import { IToken } from './IToken';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TokenOperator<T1 = any, T2 = any> = (
  token: IToken<T1>,
) => IToken<T2>;
