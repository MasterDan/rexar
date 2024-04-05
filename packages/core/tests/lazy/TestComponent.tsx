import { defineComponent } from '@core/component';
import { Ref } from '@rexar/reactivity';

export const TestComponent = defineComponent<{
  prop: string;
  prop$: Ref<string>;
}>(({ prop, prop$ }) => (
  <div>
    {prop}, {prop$}
  </div>
));

