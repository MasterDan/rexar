import { ref$ } from '@core/reactivity/ref';
import { MayBeReadonlyRef } from '@core/reactivity/ref/@types/MayBeReadonlyRef';
import { AnyComponent } from '@core/render/html/@types/any-component';
import { defineComponent } from '..';

export const ifElseComponentName = 'if-else-component';

export interface IIfElseComponentProps {
  if$: MayBeReadonlyRef<boolean>;
  ifTrue$: MayBeReadonlyRef<AnyComponent | undefined>;
  ifFalse$: MayBeReadonlyRef<AnyComponent | undefined>;
}

export const IfElseComponent = defineComponent<IIfElseComponentProps>({
  name: ifElseComponentName,
  props: () => ({
    if$: ref$(false),
    ifFalse$: ref$(),
    ifTrue$: ref$(),
  }),
});

export const ifElse = (
  if$: MayBeReadonlyRef<boolean>,
  ifTrue$?: MayBeReadonlyRef<AnyComponent>,
  ifFalse$?: MayBeReadonlyRef<AnyComponent>,
) => {
  const component = IfElseComponent.create();
  component.bindProp('if$', if$);
  component.bindProp('ifTrue$', ifTrue$);
  component.bindProp('ifFalse$', ifFalse$);
  return component;
};
