import { ComponentDefinition } from '@core/components';
import { Component, TData } from '@core/components/component';
import { ComponentType } from '@core/components/component-type';
import { ref$ } from '@core/reactivity/ref';
import { MayBeReadonlyRef } from '@core/reactivity/ref/@types/MayBeReadonlyRef';
import { AnyComponent } from '@core/render/html/@types/any-component';
import { ElementTransformer } from '@core/render/html/ref-store/element.transformer';
import { defineHook } from '@core/tools/hooks/hooks';
import { filter } from 'rxjs/internal/operators/filter';
import { take } from 'rxjs/internal/operators/take';
import { conditional } from '../../conditional.component';
import { dynamic } from '../../dynamic.component';
import { IElementComponentProps } from '../../html-element.component';
import { list } from '../../list.component';
import { BuiltInHooks } from './@types/built-in-hooks';

export interface ITransformHookParams {
  id: string;
}

export const transformHook = defineHook<
  ElementTransformer,
  ITransformHookParams
>(BuiltInHooks.Transform);

export const transform = (id: string) => {
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

  const ifTrue = (condition$: MayBeReadonlyRef<boolean>) => {
    const displaySelf = () => {
      validTransformer$.subscribe((transformer) => {
        transformer.append((c: Component<IElementComponentProps>) => {
          if (c.type !== ComponentType.HTMLElement) {
            return c;
          }

          const content =
            c.getProp('name') === 'SLOT'
              ? list(c.getProp('children') ?? [])
              : c;
          const replacement = conditional(condition$, ref$(content));
          return replacement;
        });
      });
    };

    const displaySelfOrElse = <TProps extends TData = TData>(
      definition: ComponentDefinition<TProps>,
      props?: TProps,
    ) => {
      validTransformer$.subscribe((transformer) => {
        transformer.append((c: Component<IElementComponentProps>) => {
          if (c.type !== ComponentType.HTMLElement) {
            return c;
          }

          const content =
            c.getProp('name') === 'SLOT'
              ? list(c.getProp('children') ?? [])
              : c;
          const altContent = definition.create();
          if (props) {
            altContent.bindProps(props);
          }
          const replacement = conditional(
            condition$,
            ref$(content),
            ref$(altContent),
          );
          return replacement;
        });
      });
    };

    return {
      displaySelf,
      displaySelfOrElse,
    };
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
