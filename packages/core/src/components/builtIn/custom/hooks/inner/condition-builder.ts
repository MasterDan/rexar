import { ComponentDefinition } from '@core/components';
import { conditional } from '@core/components/builtIn/conditional.component';
import { TData } from '@core/components/component';
import { ref$ } from '@core/reactivity/ref';
import { MayBeReadonlyRef } from '@core/reactivity/ref/@types/MayBeReadonlyRef';
import { Ref } from '@core/reactivity/ref/ref';
import { AnyComponent } from '@core/render/html/@types/any-component';

function buildComponent<TProps extends TData = TData>(
  definition: ComponentDefinition<TProps>,
  props?: TProps,
): AnyComponent {
  const component = definition.create();
  if (props) {
    component.bindProps(props);
  }
  return component;
}

export class ConditionBuilder {
  constructor(private condition$: MayBeReadonlyRef<boolean>) {}

  positive$: Ref<AnyComponent> | undefined;

  negaitive$: Ref<AnyComponent> | undefined;

  ifTrue<TProps extends TData = TData>(
    definition: ComponentDefinition<TProps>,
    props?: TProps,
  ) {
    this.positive$ = ref$(buildComponent(definition, props));
  }

  else<TProps extends TData = TData>(
    definition: ComponentDefinition<TProps>,
    props?: TProps,
  ) {
    this.negaitive$ = ref$(buildComponent(definition, props));
  }

  elseIf(
    elseIf$: MayBeReadonlyRef<boolean>,
    config: (builder: ConditionBuilder) => void,
  ) {
    const elseIfBuilder = new ConditionBuilder(elseIf$);
    config(elseIfBuilder);
    this.negaitive$ = ref$(elseIfBuilder.build());
  }

  build() {
    return conditional(this.condition$, this.positive$, this.negaitive$);
  }
}
