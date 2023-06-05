import 'reflect-metadata';

export { createApp } from '@core/app';
export { defineComponent } from './components';
export {
  bindStringValue,
  bindNumericValue,
  bindBooleanValue,
} from './components/builtIn/custom/hooks/bind-value.hook';
export { useElement } from './components/builtIn/custom/hooks/use-element.hook';
export { bindTextContent } from './components/builtIn/custom/hooks/text-content.hook';
export { mountComponent } from './components/builtIn/custom/hooks/mount-component.hook';
export {
  pickTemplate,
  repeatTemplate,
} from './components/builtIn/custom/hooks/pick-template.hook';
export {
  onMounted,
  onBeforeUnmount,
  onUnmounted,
} from './components/builtIn/custom/hooks/lifecycle.hook';

export { ifElse } from './components/builtIn/custom/hooks/if-else.hook';
export { ref$ } from '@core/reactivity/ref';
