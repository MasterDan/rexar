import { defineComponent } from '@core/components';
import { pickElement } from '@core/components/builtIn/custom/hooks/use-element.hook';
import { ref$ } from '@core/reactivity/ref';
import template from './test-three.component.html';

export const testThree = defineComponent({
  template: () => template,
  setup() {
    const val = ref$<string | undefined>('hello');
    pickElement('one').bindValue.string(val);
    pickElement('two').bindValue.string(val);
  },
});
