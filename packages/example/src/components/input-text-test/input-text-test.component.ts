import {
  defineComponent,
  innerTextFor,
  ref$,
  bindStringValue,
} from '@rexar/core';
// @ts-expect-error import template
import template from 'bundle-text:./input-text-test.component.html';

export const inputTextTest = defineComponent({
  template,
  setup() {
    const textOne$ = ref$('hello');
    const textTwo$ = ref$('World');
    bindStringValue('#one', textOne$);
    bindStringValue('#one-second', textOne$);
    bindStringValue('#two', textTwo$);
    innerTextFor(
      '#text',
      ref$(() => `${textOne$.val} ${textTwo$.val}`),
    );
  },
});
