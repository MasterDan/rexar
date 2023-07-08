// @ts-expect-error no types
// eslint-disable-next-line import/no-extraneous-dependencies
import printTree from 'print-tree';
import { LogRecord } from './log-record';
import { LogScope } from './log-scope';
import { LogStatus } from './log-staus';

export class ScopedLogger {
  private static rootScope = new LogScope('root');

  private static rootLogger = new ScopedLogger(this.rootScope);

  private static scopeStack: LogScope[] = [this.rootScope];

  private static all: ScopedLogger[] = [this.rootLogger];

  records: LogRecord[] = [];

  constructor(public scope: LogScope) {
    ScopedLogger.scopeStack.push(scope);
    ScopedLogger.all.push(this);
  }

  static get currentScope() {
    if (this.scopeStack.length === 0) {
      throw new Error('There are no LogScopes available');
    }
    return this.scopeStack[this.scopeStack.length - 1];
  }

  static get current() {
    const scope = this.currentScope;
    return this.all.find((l) => l.scope.key === scope.key);
  }

  static get root() {
    return this.rootLogger;
  }

  static dump() {
    printTree(
      ScopedLogger.root,
      (node: ScopedLogger) => node.toString(),
      (node: ScopedLogger) =>
        ScopedLogger.all.filter((l) => l.scope.parentKey === node.scope.key),
    );
  }

  static endScope() {
    this.scopeStack.pop();
  }

  debug(value: string) {
    this.records.push(new LogRecord(LogStatus.Debug, value));
  }

  error(value: string) {
    this.records.push(new LogRecord(LogStatus.Error, value));
  }

  info(value: string) {
    this.records.push(new LogRecord(LogStatus.Info, value));
  }

  warn(value: string) {
    this.records.push(new LogRecord(LogStatus.Warning, value));
  }

  toString() {
    return [
      `[ ${this.scope.name} ]`,
      ...this.records.map((r) => r.toString),
    ].join('\n');
  }

  createChild(name?: string) {
    const childScope = this.scope.createChild(name);
    return new ScopedLogger(childScope);
  }

  createSibling(name?: string) {
    const siblingScope = this.scope.createSibling(name);
    return new ScopedLogger(siblingScope);
  }

  end() {
    ScopedLogger.scopeStack = ScopedLogger.scopeStack.filter(
      (s) => s.key !== this.scope.key,
    );
  }
}
