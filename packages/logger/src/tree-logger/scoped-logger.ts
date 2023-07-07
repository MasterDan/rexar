import { LogRecord } from './log-record';
import { Scope } from './scope';

export class ScopedLogger {
  static All: ScopedLogger[] = [];

  records: LogRecord[] = [];

  constructor(public scope: Scope) {}

  log(value: string) {
    this.records.push(new LogRecord(value));
    ScopedLogger.All.push(this);
  }

  createChild(name?: string) {
    const childScope = this.scope.createChild(name);
    return new ScopedLogger(childScope);
  }

  createBrother(name?: string) {
    const brotherScope = this.scope.createBrother(name);
    return new ScopedLogger(brotherScope);
  }
}
