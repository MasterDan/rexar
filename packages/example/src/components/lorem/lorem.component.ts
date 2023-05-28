import { defineComponent } from '@rexar/core';
// @ts-expect-error import template
import template from 'bundle-text:./lorem.component.html';

export const lorem = defineComponent({
  template,
});
