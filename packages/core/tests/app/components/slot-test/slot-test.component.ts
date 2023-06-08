import { defineComponent } from '@core/components';
import { pickTemplate } from '@core/index';
import template from './slot-test.component.html';

export const slotTest = defineComponent({
  template: () => template,
  setup: () => {
    pickTemplate('content').defineComponent().mount('target');
  },
});
