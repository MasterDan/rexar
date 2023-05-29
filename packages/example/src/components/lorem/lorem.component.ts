import { defineComponent, fromTemplate, mountComponent } from '@rexar/core';
// @ts-expect-error import template
import template from 'bundle-text:./lorem.component.html';

export const lorem = defineComponent({
  template,
  setup() {
    const inner$ = fromTemplate({
      id: 'inner-template',
    });
    inner$.subscribe((t) => console.log(t));
    mountComponent('target', inner$);
  },
});
