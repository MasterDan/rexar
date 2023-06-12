import {
  defineComponent,
  pickElement,
  pickTemplate,
  Ref,
  ref$,
} from '@rexar/core';
import template from 'bundle-text:./input-text-test.component.html';

export const inputTextTest = defineComponent({
  template: () => template,
  setup() {
    const textOne$ = ref$('Hello');
    const textTwo$ = ref$('World');
    pickElement('one').bindValue.string(textOne$);
    pickElement('two').bindValue.string(textTwo$);
    const fullText$ = ref$(
      () => `${textOne$.value}, ${textTwo$.value}`,
      (val) => {
        const [f, s] = val.replace(',', '').split(' ');
        textOne$.value = f ?? '';
        textTwo$.value = s ?? '';
      },
    );
    pickElement('combine').bindValue.string(fullText$ as Ref<string>);
    pickElement('text').bindContent.text(fullText$);
    pickTemplate('item-template')
      .forEach(
        ref$(() =>
          fullText$.value.split('').filter((v) => v !== ' ' && v !== ','),
        ),
        (i) => i,
      )
      .defineComponent({
        setup: ({ props: itemProps }) => {
          const letter$ = ref$(() => itemProps.item.value?.value ?? '-');
          pickElement('letter').bindContent.text(letter$);
        },
      })
      .mount('letters');
  },
});
