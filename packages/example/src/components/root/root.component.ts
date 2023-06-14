import {
  defineComponent,
  into,
  onMounted,
  pickElement,
  ref$,
} from '@rexar/core';
import template from 'bundle-text:./root.component.html';
import { delay } from 'rxjs';
import { inner } from '../inner/inner.component';
import { inputCheckboxTest } from '../input-checkbox-test/input-checkbox-test.component';
import { inputNumberTest } from '../input-number-test/input-number-test.component';
import { inputTextTest } from '../input-text-test/input-text-test.component';
import { lorem } from '../lorem/lorem.component';

export const root = defineComponent({
  template: () => template,
  setup: () => {
    const showContent$ = ref$(false);
    pickElement('show-content').bindValue.boolean(showContent$);
    into('content').if(showContent$, (c) => {
      c.whenTrue.displaySelf();
    });
    into('simple-lorem-component').mountComponent(lorem);
    into('test-text-inputs-component').mountComponent(inputTextTest);
    into('test-number-inputs-component').mountComponent(inputNumberTest);
    into('test-boolean-inputs-component').mountComponent(inputCheckboxTest);
    into('inner-component').mountComponent(inner, { message: 'Hello, World!' });
    onMounted()
      .pipe(delay(1 * 10 ** 3))
      .subscribe(() => {
        showContent$.value = true;
      });
  },
});
