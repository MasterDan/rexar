import { Scope } from '@rexar/reactivity';
import { Subject } from 'rxjs';
import { RenderingScopeValue } from './scope-value';
import { RenderContext } from './context';

export type PauseFunc = (pause: boolean) => void;

export type ComponentHookValue = Subject<void>;

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
    const subject = new Subject<void>();
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
  provide: (value: T) => T;
  inject: () => T | undefined;
};
export function createProvider<T>(defaultVal: T): {
  provide: (value: T) => T;
  inject: () => T;
};
export function createProvider<T>(defaultVal?: T): {
  provide: (value: T) => T;
  inject: () => T | undefined;
} {
  const key = Symbol('provided-value');
  const getContext = () => {
    const scope = renderingScope.current;
    if (scope == null) {
      throw new Error('Scope is not defined');
    }
    return scope.value.context;
  };
  const provide = (value: T): T => {
    getContext().provide(key, value);
    return value;
  };
  const inject = (): T | undefined => getContext().inject(key, defaultVal);

  return { provide, inject };
}

export function useContext() {
  return (
    renderingScope.current?.value.context.createChildContext() ??
    new RenderContext()
  );
}
