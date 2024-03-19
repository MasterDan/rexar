import { Scope } from '@rexar/reactivity';
import { Subject } from 'rxjs';
import { RenderingScopeValue } from './scope-value';

export type ComponentHooks = {
  onRendered: Subject<void>;
  onMounted: Subject<void>;
  onBeforeDestroy: Subject<void>;
  onDestroyed: Subject<void>;
};

export type ComponentHookName = keyof ComponentHooks;

export const renderingScope = new Scope<RenderingScopeValue, ComponentHooks>();

const createHookWrapper = (hookRaw: (body: Subject<void>) => void) => () => {
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
