export { createApp } from '@core/app';
export { defineComponent } from '@core/components';
export { pickElement } from '@core/components/builtIn/custom/hooks/element-reference.hook';
export { into } from '@core/components/builtIn/custom/hooks/transform.hook';
export { pickTemplate } from '@core/components/builtIn/custom/hooks/pick-template.hook';
export {
  onMounted,
  onBeforeUnmount,
  onUnmounted,
} from '@core/components/builtIn/custom/hooks/lifecycle.hook';

export { createEvent, triggerEvent } from './components/events';
export { EventEmitter } from './components/events/event';

export type { MayBeReadonlyRef, MaybeObservable } from '@rexar/reactivity';

export {
  ref$,
  readonly,
  Ref,
  ReadonlyRef,
  WritableReadonlyRef,
} from '@rexar/reactivity';
