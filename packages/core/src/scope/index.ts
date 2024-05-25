import { Scope } from '@rexar/reactivity';
import { Subject } from 'rxjs';
import { RenderingScopeValue } from './scope-value';

export type PauseFunc = (pause: boolean) => void;

export type ComponentHookValue = Subject<PauseFunc>;

export type ComponentHooks = {
  onRendered: ComponentHookValue;
  onMounted: ComponentHookValue;
  onBeforeDestroy: ComponentHookValue;
  onDestroyed: ComponentHookValue;
};

export type ComponentHookName = keyof ComponentHooks;

export const renderingScope = new Scope<RenderingScopeValue, ComponentHooks>();

const createHookWrapper =
  (hookRaw: (body: ComponentHookValue) => void) => () => {
    const subject = new Subject<PauseFunc>();
    hookRaw(subject);
    return subject;
  };

export const onRendered = createHookWrapper(
  renderingScope.createHook('onRendered'),
);
export const onMounted = createHookWrapper(
  renderingScope.createHook('onMounted'),
);
export const onBeforeDestroy = createHookWrapper(
  renderingScope.createHook('onBeforeDestroy'),
);
export const onDestroyed = createHookWrapper(
  renderingScope.createHook('onDestroyed'),
);

export function createProvider<T>(): {
  provide: (value: T) => void;
  inject: () => T | undefined;
};
export function createProvider<T>(defaultVal: T): {
  provide: (value: T) => void;
  inject: () => T;
};
export function createProvider<T>(defaultVal?: T): {
  provide: (value: T) => void;
  inject: () => T | undefined;
} {
  const key = Symbol('provided-value');
  const getScope = () => {
    const scope = renderingScope.current;
    if (scope == null) {
      throw new Error('Scope is not defined');
    }
    return scope;
  };
  const provide = (value: T) => {
    getScope().value.context.provide(key, value);
  };
  const inject = (): T | undefined =>
    getScope().value.context.inject(key, defaultVal);

  return { provide, inject };
}
