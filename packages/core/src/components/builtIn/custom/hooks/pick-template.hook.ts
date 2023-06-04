import { ComponentDefinition, defineComponent } from '@core/components';
import { TData } from '@core/components/component';
import { readonly, ref$ } from '@core/reactivity/ref';
import { MayBeReadonlyRef } from '@core/reactivity/ref/@types/MayBeReadonlyRef';
import { Ref } from '@core/reactivity/ref/ref';
import { AnyComponent } from '@core/render/html/@types/any-component';
import { defineHook } from '@core/tools/hooks/hooks';
import { combineLatest, filter, map, Observable, tap } from 'rxjs';
import {
  IListComponentProps,
  listComponentDefinition,
} from '../../list.component';
import { SetupFn } from '../custom-template-component';
import { BuiltInHooks } from './@types/built-in-hooks';

export interface IPickTemplateArgs<TProps extends TData = TData> {
  id: string;
  props?: () => TProps;
  setup?: SetupFn<TProps>;
}

export interface IPickTemplateHookArgs {
  id: string;
}

const pickTemplateHook = defineHook<AnyComponent[], IPickTemplateHookArgs>(
  BuiltInHooks.PickTemplate,
);

export const pickTemplate = <TProps extends TData = TData>(
  arg: IPickTemplateArgs<TProps>,
): Observable<ComponentDefinition<TProps>> => {
  const componentDefinition$ = ref$<ComponentDefinition<TProps>>();
  pickTemplateHook(
    (template) => {
      componentDefinition$.value = defineComponent<TProps>({
        template: () => template,
        setup: arg.setup,
        props: arg.props ?? (() => ({} as TProps)),
      });
    },
    {
      id: arg.id,
    },
  );
  return readonly(componentDefinition$).pipe(
    filter((x): x is ComponentDefinition<TProps> => x != null),
  );
};

export class ArrayItem<TItem> {
  key: string | number | symbol;

  constructor(
    public value: TItem,
    public index: number,
    keyGetter: (item: TItem, index: number) => string | number | symbol,
  ) {
    this.key = keyGetter(value, index);
  }
}

export interface IArrayItemProps<TItem> {
  item: Ref<ArrayItem<TItem> | undefined>;
}

export interface IRepeatTemplateArgs<TItem> {
  templateId: string;
  key: (item: TItem, index: number) => string | number | symbol;
  array: MayBeReadonlyRef<TItem[]>;
  setup?: SetupFn<IArrayItemProps<TItem>>;
}

export const repeatTemplate = <TItem>(arg: IRepeatTemplateArgs<TItem>) => {
  const arrayItems$ = ref$(() =>
    arg.array.value.map((v, i) => new ArrayItem(v, i, arg.key)),
  );
  const template$ = ref$<AnyComponent[]>();

  pickTemplateHook(
    (template) => {
      template$.value = template;
    },
    {
      id: arg.templateId,
    },
  );

  const componentDefinition$ = ref$(
    template$.pipe(
      filter((t): t is AnyComponent[] => t != null && t.length > 0),
      tap(() => {
        console.log('template changed');
      }),
      map((t) =>
        defineComponent<IArrayItemProps<TItem>>({
          template: () => t,
          props: () => ({
            item: ref$(),
          }),
        }),
      ),
    ),
  );
  const components$ = ref$(
    combineLatest([componentDefinition$, arrayItems$]).pipe(
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
        console.log('components:', components.length);
        return components;
      }),
    ),
    [],
  );

  const props: IListComponentProps = {
    content: components$,
    isArray: true,
  };
  return {
    definition: listComponentDefinition,
    props,
  };
};
