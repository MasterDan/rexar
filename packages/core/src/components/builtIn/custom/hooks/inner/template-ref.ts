import { defineComponent } from '@core/components';
import { listComponentDefinition } from '@core/components/builtIn/list.component';
import { TData } from '@core/components/component';
import { ComponentDefinition } from '@core/components/component-definition-builder';
import { ref$ } from '@core/reactivity/ref';
import { MayBeReadonlyRef } from '@core/reactivity/ref/@types/MayBeReadonlyRef';
import { Ref } from '@core/reactivity/ref/ref';
import { AnyComponent } from '@core/render/html/@types/any-component';
import { combineLatest, filter, map, Observable } from 'rxjs';
import { SetupFn } from '../../custom-template.component';
import { into } from '../transform.hook';
import { ArrayItem } from './array-item';

export interface IMakeCompponentArgs<TProps extends TData = TData> {
  props?: () => TProps;
  setup?: SetupFn<TProps>;
}

export interface IArrayItemProps<TItem> {
  item: Ref<ArrayItem<TItem> | undefined>;
}

export class TemplateRef {
  private validTemplate$: Observable<AnyComponent[]>;

  constructor(private template$: MayBeReadonlyRef<AnyComponent[] | undefined>) {
    this.validTemplate$ = this.template$.pipe(
      filter((t): t is AnyComponent[] => t != null),
    );
  }

  defineComponent<TProps extends TData = TData>(
    args: IMakeCompponentArgs<TProps> = {},
  ) {
    const componentDef$ = ref$(
      this.validTemplate$.pipe(
        map((t) =>
          defineComponent<TProps>({
            template: (b) => b.fromComponents(t),
            setup: args.setup,
            props: args.props ?? (() => ({} as TProps)),
          }),
        ),
      ),
    );

    return {
      componentDef$,
      mount: (id: string) => {
        into(id).mountComponent(componentDef$);
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
      defineComponent: (
        arg: Omit<IMakeCompponentArgs<IArrayItemProps<TItem>>, 'props'>,
      ) => {
        const componentDef$ = this.validTemplate$.pipe(
          map((t) =>
            defineComponent<IArrayItemProps<TItem>>({
              template: (b) => b.fromComponents(t),
              props: () => ({
                item: ref$(),
              }),
              setup: arg.setup,
            }),
          ),
        );

        return {
          mount: (id: string) => {
            const itemComponents$ = ref$(
              combineLatest([componentDef$, arrayItems$]).pipe(
                filter(
                  (
                    arr,
                  ): arr is [
                    ComponentDefinition<IArrayItemProps<TItem>>,
                    ArrayItem<TItem>[],
                  ] => arr[0] != null,
                ),
                map(([definition, arrayItems]) => {
                  const components = arrayItems.map((i) => {
                    const component = definition.create();
                    component.bindProp('item', i);
                    return component;
                  });
                  return components;
                }),
              ),
              [],
            );
            into(id).mountComponent(listComponentDefinition, {
              content: itemComponents$,
              isArray: true,
            });
          },
        };
      },
    };
  }
}
