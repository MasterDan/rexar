import { ComponentDefinition } from '@core/components';
import { conditional } from '@core/components/builtIn/conditional.component';
import { IElementComponentProps } from '@core/components/builtIn/element.component';
import { list } from '@core/components/builtIn/list.component';
import { Component, TData } from '@core/components/component';
import { ComponentType } from '@core/components/component-type';
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

export function displaySelf(component: Component<IElementComponentProps>) {
  if (component.type !== ComponentType.HTMLElement) {
    return component;
  }

  const self =
    component.getProp('name') === 'SLOT'
      ? list(component.getProp('children') ?? [])
      : component;
  return self;
}

export class ConditionBuilder {
  constructor(
    private condition$: MayBeReadonlyRef<boolean>,
    private self?: Component<IElementComponentProps>,
  ) {}

  private positive$: Ref<AnyComponent> | undefined | 'self';

  private negative$: Ref<AnyComponent> | undefined | 'self';

  get whenTrue() {
    return {
      displayComponent: <TProps extends TData = TData>(
        definition: ComponentDefinition<TProps>,
        props?: TProps,
      ): ConditionBuilder => {
        this.positive$ = ref$(buildComponent(definition, props));
        return this;
      },
      displaySelf: (): ConditionBuilder => {
        this.positive$ = 'self';
        return this;
      },
      if: (
        elseIf$: MayBeReadonlyRef<boolean>,
        config: (builder: ConditionBuilder) => void,
      ) => {
        const builder = new ConditionBuilder(elseIf$, this.self);
        config(builder);
        this.positive$ = ref$(builder.build());
      },
    };
  }

  get whenFalse() {
    return {
      displayComponent: <TProps extends TData = TData>(
        definition: ComponentDefinition<TProps>,
        props?: TProps,
      ): ConditionBuilder => {
        this.negative$ = ref$(buildComponent(definition, props));
        return this;
      },
      displaySelf: (): ConditionBuilder => {
        this.negative$ = 'self';
        return this;
      },
      if: (
        elseIf$: MayBeReadonlyRef<boolean>,
        config: (builder: ConditionBuilder) => void,
      ) => {
        const builder = new ConditionBuilder(elseIf$, this.self);
        config(builder);
        this.negative$ = ref$(builder.build());
      },
    };
  }

  build() {
    const extract = (
      val: Ref<AnyComponent> | undefined | 'self',
    ): Ref<AnyComponent> | undefined => {
      if (val !== 'self') {
        return val;
      }
      return this.self == null ? undefined : ref$(displaySelf(this.self));
    };

    return conditional(
      this.condition$,
      extract(this.positive$),
      extract(this.negative$),
    );
  }
}
