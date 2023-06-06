import {
  defineComponent,
  pickElement,
  ref$,
  repeatTemplate,
} from '@rexar/core';
import template from 'bundle-text:./input-text-test.component.html';

export const inputTextTest = defineComponent({
  template: () => template,
  setup() {
    const textOne$ = ref$('Hello');
    const textTwo$ = ref$('World');
    pickElement('one').bindValue.string(textOne$);
    pickElement('one:copy').bindValue.string(textOne$);
    pickElement('two').bindValue.string(textTwo$);
    const fullText$ = ref$(() => `${textOne$.value}, ${textTwo$.value}`);
    pickElement('text').bindContent.text(fullText$);
    repeatTemplate({
      templateId: 'item-template',
      array: ref$(() => fullText$.value.split('').filter((v) => v !== ' ')),
      key: (i) => i,
      setup: ({ props: itemProps }) => {
        const letter$ = ref$(() => ` ${itemProps.item.value?.value ?? '-'}`);
        pickElement('letter').bindContent.text(letter$);
      },
    }).mount('letters');
  },
});
