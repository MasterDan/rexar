import { HistoryBase } from './base.history';
import { HistoryHash } from './hash.history';
import { History } from './history';

export type HistoryMode = (baseUrl?: string) => HistoryBase;

export const history: HistoryMode = (baseUrl) => new History(baseUrl);

export const historyHash: HistoryMode = (baseUrl) => new HistoryHash(baseUrl);

