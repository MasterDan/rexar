import { ComponentDefinition, defineComponent } from '@core/components';
import { TData } from '@core/components/component';
import { readonly, ref$ } from '@core/reactivity/ref';
import { AnyComponent } from '@core/render/html/@types/any-component';
import { defineHook } from '@core/tools/hooks/hooks';
import { filter, Observable } from 'rxjs';
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

export const fromTemplate = <TProps extends TData = TData>(
  arg: IPickTemplateArgs<TProps>,
): Observable<ComponentDefinition<TProps>> => {
  const componentDefinition$ = ref$<ComponentDefinition<TProps>>();
  pickTemplateHook(
    (template) => {
      componentDefinition$.val = defineComponent<TProps>({
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
