import { singleton } from 'tsyringe';
import { ElementReference } from './element.reference';

export type Reference = ElementReference;

type RefStorage = Record<string, Reference | undefined>;

@singleton()
export class RefStore {
  private storages: Record<symbol, RefStorage | undefined> = {};

  private stack: symbol[] = [];

  get currentScopeKey() {
    return this.stack.length <= 0
      ? undefined
      : this.stack[this.stack.length - 1];
  }

  beginScope(scopeName: string) {
    const scopeKey = Symbol.for(scopeName);
    if (this.storages[scopeKey] == null) {
      this.storages[scopeKey] = {};
    }
    this.stack.push(scopeKey);
  }

  endScope() {
    this.stack.pop();
  }

  setReferece(name: string, reference: Reference) {
    const scopeKey = this.currentScopeKey;
    if (scopeKey == null) {
      return;
    }
    const scope = this.storages[scopeKey];
    if (scope == null) {
      return;
    }
    scope[name] = reference;
  }
}
