import {
  defineComponent,
  bindTextContent,
  ref$,
  bindStringValue,
  repeatTemplate,
} from '@rexar/core';
import template from 'bundle-text:./input-text-test.component.html';

export const inputTextTest = defineComponent({
  template: () => template,
  setup() {
    const textOne$ = ref$('Hello');
    const textTwo$ = ref$('World');
    bindStringValue('one', textOne$);
    bindStringValue('one-second', textOne$);
    bindStringValue('two', textTwo$);
    const fullText$ = ref$(() => `${textOne$.value}, ${textTwo$.value}`);
    bindTextContent('text', fullText$);
    repeatTemplate({
      templateId: 'item-template',
      array: ref$(() => fullText$.value.split('').filter((v) => v !== ' ')),
      key: (i) => i,
      setup: ({ props: itemProps }) => {
        const letter$ = ref$(() => ` ${itemProps.item.value?.value ?? '-'}`);
        bindTextContent('letter', letter$);
      },
    }).mount('letters');
  },
});
