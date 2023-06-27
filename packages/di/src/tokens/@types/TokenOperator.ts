import { IToken } from './IToken';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TokenOperator<V1 = any, R1 = any, V2 = any, R2 = any> = (
  token: IToken<V1, R1>,
) => IToken<V2, R2>;
