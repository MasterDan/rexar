import { ref$ } from '@core/reactivity/ref';
import { AnyComponent } from '@core/render/html/@types/any-component';
import { MayBeReadonlyRef } from 'packages/core/dist/types';
import { defineComponent } from '..';
import { ComponentType } from '../component-type';

export interface IListComponentProps {
  content: MayBeReadonlyRef<AnyComponent[]>;
  isArray: boolean;
}

export const listComponentDefinition = defineComponent<IListComponentProps>({
  props: () => ({ content: ref$<AnyComponent[]>([]), isArray: false }),
  type: ComponentType.List,
});

export const list = (
  components: AnyComponent[],
  opts?: { isArray: boolean },
) => {
  const listComp = listComponentDefinition.create();
  listComp.bindProp('content', components);
  listComp.bindProp('isArray', opts?.isArray ?? false);
  return listComp;
};

