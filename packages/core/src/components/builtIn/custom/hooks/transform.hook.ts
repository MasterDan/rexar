import { MaybeObservable } from '@core/@types/MaybeObservable';
import { Component, TData } from '@core/components/component';
import { ComponentDefinition } from '@core/components/component-definition-builder';
import { ComponentType } from '@core/components/component-type';
import { HtmlElementNames } from '@core/parsers/html/tags/html-names';
import { ref$, MayBeReadonlyRef } from '@rexar/reactivity';

import { AnyComponent } from '@core/render/html/@types/any-component';
import { ElementTransformer } from '@core/render/html/ref-store/element.transformer';
import { defineHook } from '@core/tools/hooks/hooks';
import { combineLatest, filter, take } from 'rxjs';
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

export const into = (id: string) => {
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

  const mountDynamic = (
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
        if (c.getProp('name') === HtmlElementNames.Slot) {
          return dynamicContent;
        }
        c.bindProp('children', [dynamicContent]);
        return c;
      });
    });
  };

  const mountComponent = <TProps extends TData>(
    componentOrDefinition: MaybeObservable<
      ComponentDefinition<TProps> | undefined
    >,
    props?: TProps,
  ) => {
    const validComponentDef$ = ref$(componentOrDefinition).pipe(
      filter((x): x is ComponentDefinition<TProps> => x != null),
    );

    combineLatest([validTransformer$, validComponentDef$]).subscribe(
      ([transformer, componentDef]) => {
        transformer.append((c) => {
          if (c.type !== ComponentType.HTMLElement) {
            return c;
          }
          const newComponent = componentDef.create();
          if (props) {
            newComponent.bindProps(props);
          }

          if (c.getProp('name') !== HtmlElementNames.Slot) {
            c.bindProp('children', [newComponent]);
            c.preventTransformation = true;
            return c;
          }
          return newComponent;
        });
      },
    );
  };

  return {
    if: ifTrue,
    mountDynamic,
    mountComponent,
  };
};
