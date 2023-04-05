import { AnyRecord } from '@core/@types/AnyRecord';
import { HookBase } from './hook-base';

export class DataHook<T extends AnyRecord> extends HookBase {
  constructor(public value: T) {
    super();
  }
}
