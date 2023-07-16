import { conditional } from '@core/components/builtIn/conditional.component';
import { IElementComponentProps } from '@core/components/builtIn/element.component';
import { list } from '@core/components/builtIn/list.component';
import { Component, TData } from '@core/components/component';
import { ComponentDefinition } from '@core/components/component-definition-builder';
import { ComponentType } from '@core/components/component-type';
import { ref$, MayBeReadonlyRef } from '@rexar/reactivity';
import { AnyComponent } from '@core/render/html/@types/any-component';
import { Observable } from 'rxjs';

function buildComponent<TProps extends TData = TData>(
  definition:
    | ComponentDefinition<TProps>
    | Observable<ComponentDefinition<TProps> | undefined>,
  props?: TProps,
): MayBeReadonlyRef<AnyComponent | undefined> {
  const defRef$ = ref$(definition) as MayBeReadonlyRef<
    ComponentDefinition | undefined
  >;
  return ref$<AnyComponent | undefined>(() => {
    if (defRef$.value == null) {
      return undefined;
    }
    const component = defRef$.value.create();
    if (props) {
      component.bindProps(props);
    }
    return component;
  });
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

  private positive$:
    | MayBeReadonlyRef<AnyComponent | undefined>
    | undefined
    | 'self';

  private negative$:
    | MayBeReadonlyRef<AnyComponent | undefined>
    | undefined
    | 'self';

  get whenTrue() {
    return {
      displayComponent: <TProps extends TData = TData>(
        definition:
          | ComponentDefinition<TProps>
          | Observable<ComponentDefinition<TProps> | undefined>,
        props?: TProps,
      ): ConditionBuilder => {
        this.positive$ = buildComponent(definition, props);
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
        this.positive$ = ref$<AnyComponent | undefined>(builder.build());
      },
    };
  }

  get whenFalse() {
    return {
      displayComponent: <TProps extends TData = TData>(
        definition:
          | ComponentDefinition<TProps>
          | Observable<ComponentDefinition<TProps> | undefined>,
        props?: TProps,
      ): ConditionBuilder => {
        this.negative$ = buildComponent(definition, props);
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
        this.negative$ = ref$<AnyComponent | undefined>(builder.build());
      },
    };
  }

  build() {
    const extract = (
      val: MayBeReadonlyRef<AnyComponent | undefined> | undefined | 'self',
    ): MayBeReadonlyRef<AnyComponent | undefined> | undefined => {
      if (val !== 'self') {
        return val;
      }
      return this.self == null
        ? undefined
        : ref$<AnyComponent | undefined>(displaySelf(this.self));
    };

    return conditional(
      this.condition$,
      extract(this.positive$),
      extract(this.negative$),
    );
  }
}
