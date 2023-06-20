import { ref$, MayBeReadonlyRef } from '@rexar/reactivity';
import { AnyComponent } from '@core/render/html/@types/any-component';
import { defineComponent } from '..';
import { ComponentType } from '../component-type';

export const ifElseComponentName = 'if-else-component';

export interface IConditionalComponentProps {
  if$: MayBeReadonlyRef<boolean>;
  ifTrue$: MayBeReadonlyRef<AnyComponent | undefined>;
  ifFalse$: MayBeReadonlyRef<AnyComponent | undefined>;
}

const conditionalComponentDefinition =
  defineComponent<IConditionalComponentProps>({
    type: ComponentType.Conditional,
    props: () => ({
      if$: ref$(false),
      ifFalse$: ref$(),
      ifTrue$: ref$(),
    }),
  });

export const conditional = (
  if$: MayBeReadonlyRef<boolean>,
  ifTrue$?: MayBeReadonlyRef<AnyComponent>,
  ifFalse$?: MayBeReadonlyRef<AnyComponent>,
) => {
  const component = conditionalComponentDefinition.create();
  component.bindProp('if$', if$);
  component.bindProp('ifTrue$', ifTrue$);
  component.bindProp('ifFalse$', ifFalse$);
  return component;
};

