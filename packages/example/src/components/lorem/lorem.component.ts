import {
  defineComponent,
  innerTextFor,
  ref$,
  bindStringValue,
  bindNumericValue,
  bindBooleanValue,
} from '@rexar/core';
// @ts-expect-error import template
import template from 'bundle-text:./lorem.component.html';

export const lorem = defineComponent({
  template,
  setup() {
    const textOne$ = ref$<string>('hello');
    const textTwo$ = ref$<string>('World');
    bindStringValue('#one', textOne$);
    bindStringValue('#two', textTwo$);
    innerTextFor(
      '#text',
      ref$(() => `${textOne$.val} ${textTwo$.val}`),
    );
    const num$ = ref$<number>(2);
    const num2$ = ref$<number>(2);
    bindNumericValue('#number', num$);
    bindNumericValue('#number-two', num2$);
    innerTextFor(
      '#sum-text',
      ref$(() => `${num$.val} + ${num2$.val} = ${num$.val + num2$.val}`),
    );
    const checkOne$ = ref$(true);
    const checkTwo$ = ref$(false);
    bindBooleanValue('#checkbox-one', checkOne$);
    bindBooleanValue('#checkbox-two', checkTwo$);
    innerTextFor(
      '#options-text',
      ref$(
        () =>
          ` ${checkOne$.val ? 'Option checked' : ''} ${
            checkTwo$.val ? 'Second Option checked' : ''
          }`,
      ),
    );
  },
});
