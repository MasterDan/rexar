import { defineComponent } from '@core/components';
import { pickTemplate } from '@core/index';
import template from './slot-test.component.html?raw';

export const slotTest = defineComponent({
  template: (c) => c.fromString(template),
  setup: () => {
    pickTemplate('content').defineComponent().mount('target');
  },
});
