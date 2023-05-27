import 'reflect-metadata';

export { createApp } from '@core/app';
export { defineComponent } from './components';
export {
  bindStringValue,
  bindNumericValue,
  bindBooleanValue,
} from './components/builtIn/custom/hooks/bind-value.hook';
export { useElement } from './components/builtIn/custom/hooks/use-element.hook';
export { innerTextFor } from './components/builtIn/custom/hooks/inner-text-for.hook';
export { mountComponent } from './components/builtIn/custom/hooks/mount-component.hook';

export { ref$ } from '@core/reactivity/ref';
