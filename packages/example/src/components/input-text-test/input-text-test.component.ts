import {
  defineComponent,
  pickElement,
  pickTemplate,
  Ref,
  ref$,
} from '@rexar/core';

export const inputTextTest = defineComponent({
  template: (c) =>
    c.fromModule(() => import('./input-text-test.component.html')),
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
    const letters$ = ref$(() =>
      fullText$.value.split('').filter((v) => /\w/gm.exec(v)),
    );
    letters$.subscribe((l) => {
      console.log('Letters are:', l);
    });
    pickTemplate('item-template')
      .forEach(letters$, (i) => i)
      .defineComponent({
        setup: ({ props: itemProps }) => {
          const letter$ = ref$(() => itemProps.item.value?.value ?? '-');
          pickElement('letter').bindContent.text(letter$);
        },
      })
      .mount('letters');

    const html$ = ref$(
      '<h2>This is html</h2>\n<pre>\n<code>foo\nbar\nbaz\n</code>\n</pre>',
    );
    pickElement('html-input').bindValue.string(html$);
    pickElement('html').bindContent.html(html$);
  },
});
