import { defineComponent } from '@core/components';
import { bindStringValue } from '@core/components/builtIn/custom/hooks/bind-value.hook';
import { ref$ } from '@core/reactivity/ref';
import template from './test-three.component.html';

export const testThree = defineComponent({
  template: () => template,
  setup() {
    const val = ref$<string | undefined>('hello');
    bindStringValue('one', val);
    bindStringValue('two', val);
  },
});
