import { ref$, MayBeReadonlyRef } from '@rexar/reactivity';
import { AnyComponent } from '@core/render/html/@types/any-component';
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
  listComp.bindProp('content', ref$(components));
  listComp.bindProp('isArray', opts?.isArray ?? false);
  return listComp;
};

