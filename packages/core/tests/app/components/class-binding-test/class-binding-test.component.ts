import { defineComponent } from '@core/components';
import {
  ClassBinding,
  CssProperties,
  Ref,
  pickElement,
  ref$,
} from '@core/index';

export const classBindingTest = defineComponent<{
  class: Ref<ClassBinding>;
  style: Ref<CssProperties | string>;
}>({
  template: (c) =>
    c.fromModule(() => import('./class-binding-test.component.html?raw')),
  props: () => ({
    class: ref$<ClassBinding>(''),
    style: ref$<CssProperties | string>(''),
  }),
  setup({ props }) {
    const targetRef = pickElement('target');
    targetRef.bindClass(props.class);
    targetRef.bindStyle(props.style);
  },
});
