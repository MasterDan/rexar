import { Templates } from '@core/parsers/html';
import { ref$ } from '@core/reactivity/ref';
import { Ref } from '@core/reactivity/ref/ref';
import { filter } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { singleton } from 'tsyringe';
import { ComponentLifecycle } from '../base/lifecycle';
import { ElementReference } from './element.reference';
import { ElementTransformer } from './element.transformer';

export interface INodeRefs {
  reference: ElementReference;
  transformer: ElementTransformer;
}

type RefStorage = Record<string, INodeRefs | undefined>;

type InnerTemplates = Templates['inner'];

@singleton()
/** Global storage for Components or HTML elements */
export class RefStore {
  private storages: Record<symbol, RefStorage | undefined> = {};

  private innerTemplates: Record<symbol, Ref<InnerTemplates>> = {};

  private lifecycles: Record<symbol, Observable<ComponentLifecycle>> = {};

  private scopeStack: symbol[] = [];

  get currentScopeKey() {
    return this.scopeStack.length <= 0
      ? undefined
      : this.scopeStack[this.scopeStack.length - 1];
  }

  beginScope(scopeName: string, lifecycle$: Observable<ComponentLifecycle>) {
    const scopeKey = Symbol(scopeName);
    if (this.storages[scopeKey] == null) {
      this.storages[scopeKey] = {};
    }
    if (this.innerTemplates[scopeKey] == null) {
      this.innerTemplates[scopeKey] = ref$({});
    }
    this.lifecycles[scopeKey] = lifecycle$;
    lifecycle$
      .pipe(filter((l) => l === ComponentLifecycle.Unmounted))
      .subscribe(() => {
        delete this.lifecycles[scopeKey];
      });
    this.scopeStack.push(scopeKey);
  }

  endScope() {
    this.scopeStack.pop();
  }

  public getReferences(id: string): INodeRefs {
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
        transformer: new ElementTransformer(),
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return scope[id]!;
  }

  public getTemplate(id: string) {
    const scopeKey = this.currentScopeKey;
    if (scopeKey == null) {
      throw new Error('Scope is not defined');
    }
    return ref$(() => {
      const templates = this.innerTemplates[scopeKey].value;
      if (templates == null) {
        throw new Error('Templates for scope hasnt been instantiated');
      }
      return templates[id] ?? [];
    });
  }

  public setInnerTemplates(val: InnerTemplates) {
    const scopeKey = this.currentScopeKey;
    if (scopeKey == null) {
      throw new Error('Scope is not defined');
    }
    this.innerTemplates[scopeKey].value = val;
  }

  public getLifecycle() {
    const scopeKey = this.currentScopeKey;
    if (scopeKey == null) {
      throw new Error('Scope is not defined');
    }
    if (this.lifecycles[scopeKey] == null) {
      throw new Error('Cannot find lifecycle');
    }
    return this.lifecycles[scopeKey];
  }
}
