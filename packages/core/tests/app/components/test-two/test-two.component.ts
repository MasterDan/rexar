import { defineComponent } from '@core/components';
// @ts-expect-error importing html
import template from './test-two.component.html';

export const testTwo = defineComponent({
  template,
});
