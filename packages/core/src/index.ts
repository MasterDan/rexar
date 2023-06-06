import 'reflect-metadata';

export { createApp } from '@core/app';
export { defineComponent } from './components';
export { pickElement } from './components/builtIn/custom/hooks/use-element.hook';
export { mountComponent } from './components/builtIn/custom/hooks/mount-component.hook';
export { pickTemplate } from './components/builtIn/custom/hooks/pick-template.hook';
export {
  onMounted,
  onBeforeUnmount,
  onUnmounted,
} from './components/builtIn/custom/hooks/lifecycle.hook';

export { ifElse } from './components/builtIn/custom/hooks/if-else.hook';
export { ref$ } from '@core/reactivity/ref';
