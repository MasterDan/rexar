import { defineComponent, ref$, onMounted, pickElement } from '@rexar/core';
import { delay } from 'rxjs';

export const inputNumberTest = defineComponent({
  template: (c) =>
    c.fromModule(() => import('./input-number-test.component.html?raw')),
  setup() {
    const numberOne$ = ref$(2);
    const numberTwo$ = ref$(2);
    pickElement('number').bindValue.number(numberOne$);
    pickElement('number-copy').bindValue.number(numberOne$);
    pickElement('number-two').bindValue.number(numberTwo$);

    const numberToString = (numb = 0) => (numb >= 0 ? `${numb}` : `(${numb})`);

    const numberOneString = ref$(() => numberToString(numberOne$.value));
    const numberTwoString = ref$(() => numberToString(numberTwo$.value));
    const sumString = ref$(() =>
      numberToString((numberOne$.value ?? 0) + (numberTwo$.value ?? 0)),
    );

    pickElement('sum-text').bindContent.text(
      ref$(
        () =>
          `${numberOneString.value} + ${numberTwoString.value} = ${sumString.value}`,
      ),
    );
    onMounted()
      .pipe(delay(2 * 10 ** 3))
      .subscribe(() => {
        numberOne$.value = 10;
      });
    pickElement('multiply')
      .on('click')
      .subscribe(() => {
        numberOne$.patch((x) => x * 2);
        numberTwo$.patch((x) => x * 2);
      });
  },
});
