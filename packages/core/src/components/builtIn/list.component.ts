import { AnyComponent } from '@core/render/html/@types/any-component';
import { defineComponent } from '..';
import { Component } from '../component';
import { ITextComponentProps, textComponentName } from './text.component';

export interface IListComponentProps {
  content: AnyComponent[];
}

export const listComponentName = 'list';

export const listComponent = defineComponent<IListComponentProps>({
  props: { content: [] },
  name: listComponentName,
});

export const list = (components: AnyComponent[]) => {
  const listComp = listComponent.create();

  listComp.bindProp(
    'content',
    components.map((c, i, a) => {
      if (c.name === textComponentName && i < a.length - 1) {
        (c as Component<ITextComponentProps>).bindProp(
          'trailingTemplate',
          true,
        );
      }
      return c;
    }),
  );
  return listComp;
};
