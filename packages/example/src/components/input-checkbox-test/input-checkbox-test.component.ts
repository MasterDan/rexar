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
        !checkOne$.val && !checkTwo$.val
          ? 'Nothing is checked'
          : ` ${checkOne$.val ? 'Option checked' : ''}${
              checkTwo$.val ? ' Second Option checked' : ''
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
