import { defineComponent } from '@core/components';
import { ref$, pickElement, pickTemplate } from '@core/index';
import template from './input-text-test.component.html';

export const inputTextTest = defineComponent({
  template: () => template,
  setup() {
    const textOne$ = ref$('He');
    const textTwo$ = ref$('Wo');
    pickElement('one').bindValue.string(textOne$);
    pickElement('one:copy').bindValue.string(textOne$);
    pickElement('two').bindValue.string(textTwo$);
    const fullText$ = ref$(() => `${textOne$.value}, ${textTwo$.value}`);
    pickElement('text').bindContent.text(fullText$);
    const array$ = ref$(() =>
      fullText$.value.split('').filter((v) => v !== ' '),
    );

    pickTemplate('item-template')
      .forEach(array$, (i) => i)
      .defineComponent({
        setup: ({ props: itemProps }) => {
          const letter$ = ref$(() => ` ${itemProps.item.value?.value ?? '-'}`);
          pickElement('letter').bindContent.text(letter$);
        },
      })
      .mount('letters');
  },
});
