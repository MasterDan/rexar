import {
  defineComponent,
  pickTemplate,
  bindTextContent,
  mountComponent,
  onMounted,
  ref$,
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
        bindTextContent('message', ref$('With some message'));
      },
    });
    mountComponent('target', inner$);
    onMounted(() => {
      console.log('lorem component mounted');
    });
  },
});
