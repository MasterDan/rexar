import {
  defineComponent,
  innerTextFor,
  ref$,
  bindNumericValue,
} from '@rexar/core';
// @ts-expect-error import template
import template from 'bundle-text:./input-number-test.component.html';

export const inputNumberTest = defineComponent({
  template,
  setup() {
    const num$ = ref$(2);
    const num2$ = ref$(2);
    bindNumericValue('#number', num$);
    bindNumericValue('#number-two', num2$);
    innerTextFor(
      '#sum-text',
      ref$(() => `${num$.val} + ${num2$.val} = ${num$.val + num2$.val}`),
    );
  },
});
