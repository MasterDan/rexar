import { Ctor } from '@core/@types/Ctor';
import { HookBase } from '@core/tools/hooks/hook-base';
import { singleton } from 'tsyringe';

type RefStorage = Record<string, HookBase[] | undefined>;

@singleton()
/** Global storage for Components or HTML elements */
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

  private getCurrentScopedStorage() {
    const scopeKey = this.currentScopeKey;
    if (scopeKey == null) {
      throw new Error('Scope is not defined');
    }
    const scope = this.storages[scopeKey];
    if (scope == null) {
      throw new Error('Storage for scope hasnt been instantiated');
    }
    return scope;
  }

  setReferece(name: string, reference: HookBase) {
    const scope = this.getCurrentScopedStorage();

    if (scope[name] == null) {
      scope[name] = [reference];
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      scope[name]!.push(reference);
    }
  }

  getReference<T extends HookBase>(name: string, hookClass: Ctor<T>) {
    const scope = this.getCurrentScopedStorage();
    const hooksCollection = scope[name];
    if (hooksCollection == null) {
      return null;
    }
    const result = hooksCollection.find(
      (h) => h.constructor.name === hookClass.name,
    );
    return result ?? null;
  }
}
