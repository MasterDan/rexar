import {
  defineComponent,
  pickTemplate,
  onMounted,
  ref$,
  pickElement,
} from '@rexar/core';

export const lorem = defineComponent({
  template: (c) => c.fromModule(() => import('./lorem.component.html?raw')),
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
