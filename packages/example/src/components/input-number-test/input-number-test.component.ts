import {
  defineComponent,
  innerTextFor,
  ref$,
  bindNumericValue,
} from '@rexar/core';
import template from 'bundle-text:./input-number-test.component.html';

export const inputNumberTest = defineComponent({
  template: () => template,
  setup() {
    const numberOne$ = ref$(2);
    const numberTwo$ = ref$(2);
    bindNumericValue('number', numberOne$);
    bindNumericValue('number-copy', numberOne$);
    bindNumericValue('number-two', numberTwo$);
    innerTextFor(
      'sum-text',
      ref$(
        () =>
          `${numberOne$.val} + ${numberTwo$.val} = ${
            numberOne$.val + numberTwo$.val
          }`,
      ),
    );
  },
});
