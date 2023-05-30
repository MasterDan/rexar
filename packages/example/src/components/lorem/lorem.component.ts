import {
  defineComponent,
  fromTemplate,
  innerTextFor,
  mountComponent,
  ref$,
} from '@rexar/core';
// @ts-expect-error import template
import template from 'bundle-text:./lorem.component.html';

export const lorem = defineComponent({
  template: () => template,
  setup() {
    const inner$ = fromTemplate({
      id: 'inner-template',
      setup() {
        innerTextFor('message', ref$('With some message'));
      },
    });
    mountComponent('target', inner$);
  },
});
