import { singleton } from 'tsyringe';
import { ElementReference } from './element.reference';

export interface IElementHooks {
  reference: ElementReference;
}

type RefStorage = Record<string, IElementHooks | undefined>;

@singleton()
/** Global storage for Components or HTML elements */
export class RefStore {
  private storages: Record<symbol, RefStorage | undefined> = {};

  private scopeStak: symbol[] = [];

  get currentScopeKey() {
    return this.scopeStak.length <= 0
      ? undefined
      : this.scopeStak[this.scopeStak.length - 1];
  }

  beginScope(scopeName: string) {
    const scopeKey = Symbol.for(scopeName);
    if (this.storages[scopeKey] == null) {
      this.storages[scopeKey] = {};
    }
    this.scopeStak.push(scopeKey);
  }

  endScope() {
    this.scopeStak.pop();
  }

  public getCurrentScopeComponentHooks(id: string): IElementHooks {
    const scopeKey = this.currentScopeKey;
    if (scopeKey == null) {
      throw new Error('Scope is not defined');
    }
    const scope = this.storages[scopeKey];
    if (scope == null) {
      throw new Error('Storage for scope hasnt been instantiated');
    }
    if (scope[id] == null) {
      scope[id] = {
        reference: new ElementReference(),
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return scope[id]!;
  }
}
