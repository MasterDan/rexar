import { defineComponent } from '@core/components';
import { Ref, pickElement, ref$ } from '@core/index';

export const classBindingTest = defineComponent<{
  class: Ref<string | string[] | Record<string, boolean>>;
}>({
  template: (c) =>
    c.fromModule(() => import('./class-binding-test.component.html?raw')),
  props: () => ({
    class: ref$<string | string[] | Record<string, boolean>>(''),
  }),
  setup({ props }) {
    pickElement('target').bindClass(props.class);
  },
});
