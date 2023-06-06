import {
  defineComponent,
  pickTemplate,
  mountComponent,
  onMounted,
  ref$,
  pickElement,
} from '@rexar/core';
import template from 'bundle-text:./lorem.component.html';

export const lorem = defineComponent({
  template: () => template,
  setup() {
    const inner$ = pickTemplate({
      id: 'inner-template',
      setup() {
        onMounted(() => {
          console.log('inner message component mounted');
        });
        pickElement('message').bindContent.text(ref$('With some message'));
      },
    });
    mountComponent('target', inner$);
    onMounted(() => {
      console.log('lorem component mounted');
    });
  },
});
