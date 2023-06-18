import { defineComponent } from '@core/components';
import { pickElement } from '@core/components/builtIn/custom/hooks/element-reference.hook';
import { triggerEvent } from '@core/components/events';
import { EventEmitter } from '@core/components/events/event';
import { onMounted, onUnmounted, pickTemplate } from '@core/index';
import { ref$ } from '@core/reactivity/ref';
import { MayBeReadonlyRef } from '@core/reactivity/ref/@types/MayBeReadonlyRef';
import html from './repeat.component.html';

export type LifecycleStatuses = 'mounted' | 'unmounted';

export const repeatComponent = defineComponent<{
  array$: MayBeReadonlyRef<string[]>;
  lifecycleChanged?: EventEmitter<LifecycleStatuses>;
}>({
  props: () => ({ array$: ref$<string[]>([]) }),
  template: (c) => c.fromString(html),
  setup({ props }) {
    onMounted(() => {
      triggerEvent<LifecycleStatuses>(props.lifecycleChanged, 'mounted');
    });
    onUnmounted(() => {
      triggerEvent<LifecycleStatuses>(props.lifecycleChanged, 'unmounted');
    });
    pickTemplate('item-template')
      .forEach(props.array$, (i) => i)
      .defineComponent({
        setup: ({ props: elemProps }) => {
          const text$ = ref$(() => elemProps.item.value?.value ?? '');
          pickElement('value').bindContent.text(text$);
        },
      })
      .mount('items');
  },
});
