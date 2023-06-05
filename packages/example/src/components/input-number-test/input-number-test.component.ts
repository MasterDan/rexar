import {
  defineComponent,
  bindTextContent,
  ref$,
  bindNumericValue,
  onMounted,
  onEvent,
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
    bindTextContent(
      'sum-text',
      ref$(
        () =>
          `${numberOne$.value} + ${numberTwo$.value} = ${
            numberOne$.value + numberTwo$.value
          }`,
      ),
    );
    onMounted(() => {
      setTimeout(() => {
        numberOne$.value = 10;
      }, 1000);
    });
    onEvent('multiply', 'click').subscribe(() => {
      numberOne$.patch((x) => x * 2);
      numberTwo$.patch((x) => x * 2);
    });
  },
});
