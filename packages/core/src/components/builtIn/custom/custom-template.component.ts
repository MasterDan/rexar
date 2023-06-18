import {
  TData,
  IComponentDefinitionArgs,
  Component,
} from '@core/components/component';
import { ComponentType } from '@core/components/component-type';
import type { TemplateParser, Templates } from '@core/parsers/html';
import { ref$, readonly } from '@core/reactivity/ref';
import { ReadonlyRef } from '@core/reactivity/ref/readonly.ref';
import { Observable, isObservable, filter } from 'rxjs';
import { container } from 'tsyringe';

type ToReadonlyRef<T> = T extends Observable<infer V>
  ? ReadonlyRef<V>
  : ReadonlyRef<T>;

type TPropsAccessors<TObj> = {
  [Key in keyof TObj]: ToReadonlyRef<TObj[Key]>;
};

export interface ISetupContext<TProps> {
  props: TPropsAccessors<TProps>;
}

export type SetupFn<TProps> = (context: ISetupContext<TProps>) => void;
export interface ICustomTemplateComponentDefinitionArgs<
  TProps extends TData = TData,
> extends Omit<IComponentDefinitionArgs<TProps>, 'type'> {
  setup?: SetupFn<TProps>;
  template: (parser: TemplateParser) => Promise<Templates>;
}

export class CustomTemplateComponent<
  TProps extends TData = TData,
> extends Component<TProps> {
  private setupFn?: SetupFn<TProps>;

  private $template = ref$<Templates>();

  get template() {
    return this.$template.pipe(filter((x): x is Templates => x != null));
  }

  propsAccessors$ = ref$(() => {
    const props = this.props$.value;
    const resultProps: Record<string, Observable<unknown>> = {};
    Object.keys(props).forEach((pk) => {
      const item = props[pk];
      if (isObservable(item)) {
        resultProps[pk] = ref$(item);
      } else {
        resultProps[pk] = readonly(ref$(item));
      }
    });
    return resultProps as TPropsAccessors<TProps>;
  });

  constructor(args: ICustomTemplateComponentDefinitionArgs<TProps>) {
    super({ ...args, type: ComponentType.CustomTemplate });
    this.setupFn = args.setup;
    const parser = container.resolve<TemplateParser>('TemplateParser');
    Promise.resolve(args.template(parser)).then((t) => {
      this.$template.value = t;
    });
  }

  setup() {
    if (this.setupFn == null) {
      return;
    }
    if (this.propsAccessors$.value == null) {
      return;
    }
    this.setupFn({
      props: this.propsAccessors$.value,
    });
  }
}
