import 'reflect-metadata';

export { createApp } from '@core/app';
export { defineComponent } from './components';
export {
  bindStringValue,
  bindNumericValue,
} from './components/builtIn/custom/hooks/bind-value.hook';
export { useElement } from './components/builtIn/custom/hooks/use-element.hook';
export { innerTextFor } from './components/builtIn/custom/hooks/inner-text-for.hook';
export { ref$ } from '@core/reactivity/ref';
