import {
  defineComponent,
  innerTextFor,
  ref$,
  bindBooleanValue,
  ifElse,
} from '@rexar/core';
import template from 'bundle-text:./input-checkbox-test.component.html';
import { inner } from '../inner/inner.component';

export const inputCheckboxTest = defineComponent({
  template: () => template,
  setup() {
    const checkOne$ = ref$(true);
    const checkTwo$ = ref$(false);
    bindBooleanValue('checkbox-one', checkOne$);
    bindBooleanValue('checkbox-two', checkTwo$);
    innerTextFor(
      'options-text',
      ref$(() =>
        !checkOne$.value && !checkTwo$.value
          ? 'Nothing is checked'
          : ` ${checkOne$.value ? 'Option checked' : ''}${
              checkTwo$.value ? ' Second Option checked' : ''
            }`,
      ),
    );

    ifElse('inner', checkOne$, {
      definition: inner,
      props: {
        message: 'This component displays if first checkbox is checked',
      },
    });
    ifElse(
      'inner-two',
      checkTwo$,
      {
        definition: inner,
        props: {
          message: 'This component displays if second checkbox is checked',
        },
      },
      {
        definition: inner,
        props: {
          message: 'This component displays if second checkbox is NOT checked',
        },
      },
    );
  },
});
