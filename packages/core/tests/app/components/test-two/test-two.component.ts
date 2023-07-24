import { defineComponent } from '@core/components';
import { pickElement } from '@core/components/builtIn/custom/hooks/element-reference.hook';
import template from './test-two.component.html?raw';

export const testTwo = defineComponent({
  template: (c) => c.fromString(template),
  setup() {
    pickElement('middle').bindContent.html('middle text');
  },
});

