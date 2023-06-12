import { defineComponent, ref$, onMounted, pickElement } from '@rexar/core';
import template from 'bundle-text:./input-number-test.component.html';

export const inputNumberTest = defineComponent({
  template: () => template,
  setup() {
    const numberOne$ = ref$(2);
    const numberTwo$ = ref$(2);
    pickElement('number').bindValue.number(numberOne$);
    pickElement('number-copy').bindValue.number(numberOne$);
    pickElement('number-two').bindValue.number(numberTwo$);
    pickElement('sum-text').bindContent.text(
      ref$(
        () =>
          `${numberOne$.value} + ${numberTwo$.value} = ${
            numberOne$.value + numberTwo$.value
          }`,
      ),
    );

    onMounted(() => {
      console.log('input number is mounted');
      setTimeout(() => {
        numberOne$.value = 10;
      }, 1000);
    });
    pickElement('multiply')
      .on('click')
      .subscribe(() => {
        numberOne$.patch((x) => x * 2);
        numberTwo$.patch((x) => x * 2);
      });
  },
});
