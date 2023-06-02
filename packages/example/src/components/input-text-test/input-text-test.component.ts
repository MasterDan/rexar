import {
  defineComponent,
  innerTextFor,
  ref$,
  bindStringValue,
} from '@rexar/core';
import template from 'bundle-text:./input-text-test.component.html';

export const inputTextTest = defineComponent({
  template: () => template,
  setup() {
    const textOne$ = ref$('hello');
    const textTwo$ = ref$('World');
    bindStringValue('one', textOne$);
    bindStringValue('one-second', textOne$);
    bindStringValue('two', textTwo$);
    innerTextFor(
      'text',
      ref$(() => `${textOne$.value} ${textTwo$.value}`),
    );
  },
});
