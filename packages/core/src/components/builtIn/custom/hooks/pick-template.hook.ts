import { ref$ } from '@core/reactivity/ref';
import { AnyComponent } from '@core/render/html/@types/any-component';
import { defineHook } from '@core/tools/hooks/hooks';
import { BuiltInHooks } from './@types/built-in-hooks';
import { TemplateRef } from './inner/template-ref';

export interface IPickTemplateHookArgs {
  id: string;
}

const pickTemplateHook = defineHook<AnyComponent[], IPickTemplateHookArgs>(
  BuiltInHooks.PickTemplate,
);

export const pickTemplate = (id: string): TemplateRef => {
  const templateRef$ = ref$<AnyComponent[]>();
  pickTemplateHook(
    (template) => {
      templateRef$.value = template;
    },
    {
      id,
    },
  );
  return new TemplateRef(templateRef$);
};
