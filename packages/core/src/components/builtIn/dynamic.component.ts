import { ref$ } from '@core/reactivity/ref';
import { MayBeReadonlyRef } from '@core/reactivity/ref/@types/MayBeReadonlyRef';
import { AnyComponent } from '@core/render/html/@types/any-component';
import { defineComponent } from '..';
import { ComponentType } from '../component-type';

export interface IDynamicComponentProps {
  component$: MayBeReadonlyRef<AnyComponent | undefined>;
}

const dynamicComponentDefinition = defineComponent<IDynamicComponentProps>({
  type: ComponentType.Dynamic,
  props: () => ({
    component$: ref$<AnyComponent>(),
  }),
});

export const dynamic = (
  component$?:
    | MayBeReadonlyRef<AnyComponent | undefined>
    | MayBeReadonlyRef<AnyComponent>,
) => {
  const component = dynamicComponentDefinition.create();
  component.bindProp('component$', component$);
  return component;
};

