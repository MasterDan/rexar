import {
  defineComponent,
  pickTemplate,
  onMounted,
  ref$,
  pickElement,
} from '@rexar/core';
import template from 'bundle-text:./lorem.component.html';

export const lorem = defineComponent({
  template: () => template,
  setup() {
    pickTemplate('inner-template')
      .defineComponent({
        setup() {
          onMounted(() => {
            console.log('inner message component mounted');
          });
          pickElement('message').bindContent.text(ref$('With some message'));
        },
      })
      .mount('target');

    onMounted(() => {
      console.log('lorem component mounted');
    });
  },
});
