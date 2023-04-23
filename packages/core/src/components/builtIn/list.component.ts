import { AnyComponent } from '@core/render/html/@types/any-component';
import { defineComponent } from '..';

export interface IListComponentProps {
  content: AnyComponent[];
}

export const listComponentName = 'list';

export const listComponent = defineComponent<IListComponentProps>({
  props: { content: [] },
  name: listComponentName,
});

export const list = (components: AnyComponent[]) => {
  const lc = listComponent.create();
  lc.bindProp('content', components);
  return lc;
};
