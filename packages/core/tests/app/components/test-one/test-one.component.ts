import { defineComponent } from '@core/components';
// @ts-expect-error importing html
import template from './test-one.component.html';

export const testOne = defineComponent({
  name: 'test-one',
  template,
});
