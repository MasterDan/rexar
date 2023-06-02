import {
  defineComponent,
  fromTemplate,
  innerTextFor,
  mountComponent,
  onMounted,
  ref$,
} from '@rexar/core';
import template from 'bundle-text:./lorem.component.html';

export const lorem = defineComponent({
  template: () => template,
  setup() {
    const inner$ = fromTemplate({
      id: 'inner-template',
      setup() {
        onMounted(() => {
          console.log('inner message component mounted');
        });
        innerTextFor('message', ref$('With some message'));
      },
    });
    mountComponent('target', inner$);
    onMounted(() => {
      console.log('lorem component mounted');
    });
  },
});
