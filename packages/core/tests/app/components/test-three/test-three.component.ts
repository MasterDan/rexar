import { defineComponent } from '@core/components';
import { pickElement } from '@core/components/builtIn/custom/hooks/element-reference.hook';
import { ref$ } from '@rexar/reactivity';
import template from './test-three.component.html?raw';

export const testThree = defineComponent({
  template: (c) => c.fromString(template),
  setup() {
    const val = ref$<string | undefined>('hello');
    pickElement('one').bindValue.string(val);
    pickElement('two').bindValue.string(val);
  },
});
