import 'reflect-metadata';

export { createApp } from '@core/app';
export { defineComponent } from './components';
export { pickElement } from './components/builtIn/custom/hooks/element-reference.hook';
export { transformElement } from './components/builtIn/custom/hooks/transform-hook';
export { mountComponent } from './components/builtIn/custom/hooks/mount-component.hook';
export { pickTemplate } from './components/builtIn/custom/hooks/pick-template.hook';
export {
  onMounted,
  onBeforeUnmount,
  onUnmounted,
} from './components/builtIn/custom/hooks/lifecycle.hook';

export { ref$ } from '@core/reactivity/ref';
