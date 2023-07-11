// @ts-expect-error no types
// eslint-disable-next-line import/no-extraneous-dependencies
import printTree from 'print-tree';
import { LogRecord } from './log-record';
import { LogScope } from './log-scope';
import { LogStatus } from './log-staus';

export interface IScopeOptions {
  captureNext: boolean;
}

export class ScopedLogger {
  private static scopeStack: LogScope[] = [];

  private static all: ScopedLogger[] = [];

  private static rootScope = new LogScope('Root');

  private static rootLogger = new ScopedLogger(this.rootScope);

  records: LogRecord[] = [];

  protected constructor(public scope: LogScope) {
    ScopedLogger.scopeStack.push(scope);
    ScopedLogger.all.push(this);
  }

  static setRootName(name: string) {
    const oldKey = this.rootScope.key;
    this.rootScope = new LogScope(name);
    this.all.forEach((logger) => {
      if (logger.scope.key === oldKey) {
        logger.scope.key = this.rootScope.key;
      }
      if (logger.scope.parentKey === oldKey) {
        logger.scope.parentKey = this.rootScope.key;
      }
    });
  }

  static get currentScope() {
    if (this.scopeStack.length === 0) {
      throw new Error('There are no LogScopes available');
    }
    return this.scopeStack[this.scopeStack.length - 1];
  }

  static get current() {
    const scope = this.currentScope;
    const logger = this.all.find((l) => l.scope.key === scope.key);
    if (logger == null) {
      throw new Error('Logger not found');
    }
    return logger;
  }

  static get root() {
    return this.rootLogger;
  }

  static dump() {
    printTree(
      ScopedLogger.root,
      (node: ScopedLogger | LogRecord) => node.toString(),
      (node: ScopedLogger | LogRecord) => {
        if (node instanceof LogRecord) {
          return [];
        }
        const clildLoggers = ScopedLogger.all.filter(
          (l) => l.scope.parentKey === node.scope.key,
        );
        return [...node.records, ...clildLoggers];
      },
    );
  }

  static endScope() {
    const scope = this.scopeStack.pop();
    if (scope != null) {
      this.scopesCapturing = this.scopesCapturing.filter(
        (s) => s.key !== scope.key,
      );
    }
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
    return `[ ${this.scope.name} ]`;
  }

  static scopesCapturing: LogScope[] = [];

  static get createScope() {
    const child = (name?: string, userOptions: Partial<IScopeOptions> = {}) => {
      const { captureNext }: IScopeOptions = {
        captureNext: false,
        ...userOptions,
      };
      const logger = this.current.createChild(name);
      if (captureNext) {
        this.scopesCapturing.push(logger.scope);
      }
      return logger;
    };

    const sibling = (
      name?: string,
      userOptions: Partial<IScopeOptions> = {},
    ) => {
      const { captureNext }: IScopeOptions = {
        captureNext: false,
        ...userOptions,
      };
      const captured = this.scopesCapturing.some(
        (s) => s.key === this.currentScope.key,
      );
      const logger = captured
        ? this.current.createChild(name)
        : this.current.createSibling(name);
      if (captureNext) {
        this.scopesCapturing.push(logger.scope);
      }
      return logger;
    };

    return {
      child,
      sibling,
    };
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
