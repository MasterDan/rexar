import { defineComponent } from '@core/components';
import { bindValue } from '@core/components/builtIn/custom/custom-component-hooks';
import { ref$ } from '@core/reactivity/ref';
// @ts-expect-error template exists
import template from './test-three.component.html';

export const testThree = defineComponent({
  props: () => ({}),
  template,
  setup() {
    const val = ref$<string | undefined>('hello');
    bindValue('#one', val);
    bindValue('#two', val);
  },
});
