import {
  defineComponent,
  mountComponent,
  onMounted,
  pickElement,
  ref$,
  transformElement,
} from '@rexar/core';
import template from 'bundle-text:./root.component.html';
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
    transformElement('content').if(showContent$, (c) => {
      c.whenTrue.displaySelf();
    });
    mountComponent('simple-lorem-component', lorem);
    mountComponent('test-text-inputs-component', inputTextTest);
    mountComponent('test-number-inputs-component', inputNumberTest);
    mountComponent('test-boolean-inputs-component', inputCheckboxTest);
    mountComponent('inner-component', inner, { message: 'Hello, World!' });
    onMounted(() => {
      console.log('root component mounted');
    });
  },
});
