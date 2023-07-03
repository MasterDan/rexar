import { defineComponent } from '@core/components';
import { into, pickElement, pickTemplate } from '@core/index';
import { MayBeReadonlyRef, ref$ } from '@rexar/reactivity';

export const conditionalRepeat = defineComponent<{
  array: MayBeReadonlyRef<string[]>;
  condition: MayBeReadonlyRef<boolean>;
}>({
  props: () => ({ array: ref$<string[]>([]), condition: ref$(false) }),
  template: (b) =>
    b.fromModule(() => import('./conditional-repeat.component.html')),
  setup({ props }) {
    const { mount: mountList } = pickTemplate('list-item')
      .forEach(props.array)
      .defineComponent({
        setup({ props: itemProps }) {
          pickElement('value').bindContent.text(
            ref$(() => itemProps.item.value?.value ?? ''),
          );
        },
      });
    const { componentDef$: listDef } = pickTemplate('list').defineComponent({
      setup() {
        mountList('list-content');
      },
    });
    into('content').if(props.condition, (b) => {
      b.whenTrue.displayComponent(listDef);
    });
  },
});
