import 'reflect-metadata';

export { createApp } from '@core/app';
export { defineComponent } from '@core/components';
export { pickElement } from '@core/components/builtIn/custom/hooks/element-reference.hook';
export { transformElement } from '@core/components/builtIn/custom/hooks/transform.hook';
export { mountComponent } from '@core/components/builtIn/custom/hooks/mount-component.hook';
export { pickTemplate } from '@core/components/builtIn/custom/hooks/pick-template.hook';
export {
  onMounted,
  onBeforeUnmount,
  onUnmounted,
} from '@core/components/builtIn/custom/hooks/lifecycle.hook';

export { ref$ } from '@core/reactivity/ref';
