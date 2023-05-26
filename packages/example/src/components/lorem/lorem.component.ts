import {
  defineComponent,
  innerTextFor,
  ref$,
  bindStringValue,
  bindNumericValue,
} from '@rexar/core';
// @ts-expect-error import template
import template from 'bundle-text:./lorem.component.html';

export const lorem = defineComponent({
  template,
  setup() {
    const textOne$ = ref$<string | undefined>('hello');
    const textTwo$ = ref$<string | undefined>('World');
    bindStringValue('#one', textOne$);
    bindStringValue('#two', textTwo$);
    innerTextFor(
      '#text',
      ref$(() => `${textOne$.val} ${textTwo$.val}`),
    );
    const num$ = ref$<number | undefined>(5);
    const num2$ = ref$<number | undefined>(5);
    bindNumericValue('#number', num$);
    bindNumericValue('#number-two', num2$);
    innerTextFor(
      '#sum-text',
      ref$(
        () =>
          `${num$.val ?? 0} + ${num2$.val ?? 0} = ${
            (num$.val ?? 0) + (num2$.val ?? 0)
          }`,
      ),
    );
  },
});
