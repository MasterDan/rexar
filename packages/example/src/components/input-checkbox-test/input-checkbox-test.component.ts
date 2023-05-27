import {
  defineComponent,
  innerTextFor,
  ref$,
  bindBooleanValue,
} from '@rexar/core';
// @ts-expect-error import template
import template from 'bundle-text:./input-checkbox-test.component.html';

export const inputCheckboxTest = defineComponent({
  template,
  setup() {
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
