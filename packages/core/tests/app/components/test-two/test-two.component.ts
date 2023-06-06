import { defineComponent } from '@core/components';
import { pickElement } from '@core/components/builtIn/custom/hooks/use-element.hook';
import template from './test-two.component.html';

export const testTwo = defineComponent({
  template: () => template,
  setup() {
    pickElement('middle').bindContent.html('middle text');
  },
});

