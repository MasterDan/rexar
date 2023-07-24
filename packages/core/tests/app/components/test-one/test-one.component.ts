import { defineComponent } from '@core/components';
import template from './test-one.component.html?raw';

export const testOne = defineComponent({
  template: (c) => c.fromString(template),
});

