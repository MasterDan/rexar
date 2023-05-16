import { ref$ } from '@core/reactivity/ref';
import { Ref } from '@core/reactivity/ref/ref';
import { AnyComponent } from '@core/render/html/@types/any-component';
import { defineComponent } from '..';
import { ComponentType } from '../component-type';

export interface IListComponentProps {
  content: Ref<AnyComponent[]>;
}

export const listComponent = defineComponent<IListComponentProps>({
  props: () => ({ content: ref$<AnyComponent[]>([]) }),
  type: ComponentType.List,
});

export const list = (components: AnyComponent[]) => {
  const listComp = listComponent.create();
  listComp.bindProp('content', components);
  return listComp;
};
