import { ComponentDefinition } from '@core/components';
import { Component, TData } from '@core/components/component';
import { ComponentType } from '@core/components/component-type';
import { ref$ } from '@core/reactivity/ref';
import { MayBeReadonlyRef } from '@core/reactivity/ref/@types/MayBeReadonlyRef';
import { AnyComponent } from '@core/render/html/@types/any-component';
import { ElementTransformer } from '@core/render/html/ref-store/element.transformer';
import { defineHook } from '@core/tools/hooks/hooks';
import { filter, take } from 'rxjs';
import { dynamic } from '../../dynamic.component';
import { IElementComponentProps } from '../../element.component';
import { BuiltInHooks } from './@types/built-in-hooks';
import { ConditionBuilder } from './inner/condition-builder';

export interface ITransformHookParams {
  id: string;
}

const transformHook = defineHook<ElementTransformer, ITransformHookParams>(
  BuiltInHooks.Transform,
);

export const transformElement = (id: string) => {
  const transformerRef$ = ref$<ElementTransformer>();
  const validTransformer$ = transformerRef$.pipe(
    filter((t): t is ElementTransformer => t != null),
    take(1),
  );
  transformHook(
    (t) => {
      transformerRef$.value = t;
    },
    { id },
  );

  const ifTrue = (
    condition$: MayBeReadonlyRef<boolean>,
    config: (builder: ConditionBuilder) => void,
  ) => {
    validTransformer$.subscribe((transformer) => {
      transformer.append((c: Component<IElementComponentProps>) => {
        const builder = new ConditionBuilder(condition$, c);
        config(builder);
        c.preventTransformation = true;
        return builder.build();
      });
    });
  };

  const displayDynamicContent = (
    resolve: (
      render: <TProps extends TData = TData>(
        definition: ComponentDefinition<TProps>,
        props?: TProps,
      ) => Component<TProps>,
    ) => AnyComponent,
  ) => {
    validTransformer$.subscribe((transformer) => {
      const renderFn = <TProps extends TData = TData>(
        definition: ComponentDefinition<TProps>,
        props?: TProps,
      ) => {
        const resultComponent = definition.create();
        if (props) {
          resultComponent.bindProps(props);
        }
        return resultComponent;
      };

      const dynamicContent = dynamic(ref$(() => resolve(renderFn)));

      transformer.append((c: Component<IElementComponentProps>) => {
        if (c.type !== ComponentType.HTMLElement) {
          return c;
        }
        if (c.getProp('name') === 'SLOT') {
          return dynamicContent;
        }
        c.bindProp('children', [dynamicContent]);
        return c;
      });
    });
  };

  return {
    if: ifTrue,
    displayDynamicContent,
  };
};
