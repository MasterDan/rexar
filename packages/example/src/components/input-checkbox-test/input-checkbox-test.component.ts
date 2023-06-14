import { defineComponent, ref$, pickElement, into } from '@rexar/core';
import template from 'bundle-text:./input-checkbox-test.component.html';
import { inner } from '../inner/inner.component';

export const inputCheckboxTest = defineComponent({
  template: () => template,
  setup() {
    const checkOne$ = ref$(true);
    const checkTwo$ = ref$(false);
    pickElement('checkbox-one').bindValue.boolean(checkOne$);
    pickElement('checkbox-two').bindValue.boolean(checkTwo$);
    pickElement('options-text').bindContent.text(
      ref$(() =>
        !checkOne$.value && !checkTwo$.value
          ? 'Nothing is checked'
          : ` ${checkOne$.value ? 'Option checked' : ''}${
              checkTwo$.value ? ' Second Option checked' : ''
            }`,
      ),
    );
    into('inner').if(checkOne$, (config) => {
      config.whenTrue.displayComponent(inner, {
        message: 'This component displays if first checkbox is checked',
      });
    });
    into('inner-two').if(checkTwo$, (c) => {
      c.whenTrue.displayComponent(inner, {
        message: 'This component displays if second checkbox is checked',
      });
      c.whenFalse.displayComponent(inner, {
        message: 'This component displays if second checkbox is NOT checked',
      });
    });
  },
});
