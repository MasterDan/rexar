import { AnyToken } from '../tokens/@types/IToken';

export class DiContainer {
  tokens: Record<symbol, AnyToken> = {};
}
