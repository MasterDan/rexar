import { defineComponent } from '@core/components';
import {
  IListComponentProps,
  list,
  listComponentDefinition,
} from '@core/components/builtIn/list.component';
import { TData } from '@core/components/component';
import { ref$ } from '@core/reactivity/ref';
import { MayBeReadonlyRef } from '@core/reactivity/ref/@types/MayBeReadonlyRef';
import { Ref } from '@core/reactivity/ref/ref';
import { AnyComponent } from '@core/render/html/@types/any-component';
import { filter, map } from 'rxjs';
import { SetupFn } from '../../custom-template-component';
import { mountComponent } from '../mount-component.hook';
import { ArrayItem } from './array-item';

export interface IMakeCompponentArgs<TProps extends TData = TData> {
  props?: () => TProps;
  setup?: SetupFn<TProps>;
}

export interface IArrayItemProps<TItem> {
  item: Ref<ArrayItem<TItem> | undefined>;
}

export class TemplateRef {
  private template: AnyComponent;

  constructor(private components: AnyComponent[]) {
    this.template = components.length === 1 ? components[0] : list(components);
  }

  defineComponent<TProps extends TData = TData>(
    args: IMakeCompponentArgs<TProps> = {},
  ) {
    const componentDef = defineComponent<TProps>({
      template: () => this.components,
      setup: args.setup,
      props: args.props ?? (() => ({} as TProps)),
    });

    return {
      componentDef,
      mount: (id: string) => {
        mountComponent(id, componentDef);
      },
    };
  }

  forEach<TItem>(
    array: MayBeReadonlyRef<TItem[]>,
    key: (item: TItem, index: number) => string | number | symbol = (_, i) => i,
  ) {
    const arrayItems$ = ref$(() =>
      array.value.map((v, i) => new ArrayItem(v, i, key)),
    );
    return {
      defineComponent: (arg: IMakeCompponentArgs<IArrayItemProps<TItem>>) => {
        const componentDef = defineComponent<IArrayItemProps<TItem>>({
          template: () => this.components,
          props: () => ({
            item: ref$(),
          }),
          setup: arg.setup,
        });
        return {
          mount: (id: string) => {
            const itemComponents$ = ref$(
              arrayItems$.pipe(
                filter((arr): arr is ArrayItem<TItem>[] => arr != null),
                map((arrayItems) => {
                  const components = arrayItems.map((i) => {
                    const component = componentDef.create();
                    component.bindProp('item', i);
                    return component;
                  });
                  return components;
                }),
              ),
              [],
            );
            const props: IListComponentProps = {
              content: itemComponents$,
              isArray: true,
            };
            mountComponent(id, listComponentDefinition, props);
          },
        };
      },
    };
  }
}
