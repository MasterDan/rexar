import 'reflect-metadata';

export { createApp } from '@core/app';
export { defineComponent } from './components';
export {
  useElement,
  bindValue,
} from './components/builtIn/custom/custom-component-hooks';
export { ref$ } from '@core/reactivity/ref';
