import { singleton } from 'tsyringe';
import { ElementReference } from './element.reference';

export type NodeHook = ElementReference;

type RefStorage = Record<string, NodeHook[] | undefined>;

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

  setReferece(name: string, reference: NodeHook) {
    const scopeKey = this.currentScopeKey;
    if (scopeKey == null) {
      return;
    }
    const scope = this.storages[scopeKey];
    if (scope == null) {
      return;
    }
    if (scope[name] == null) {
      scope[name] = [reference];
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      scope[name]!.push(reference);
    }
  }
}
