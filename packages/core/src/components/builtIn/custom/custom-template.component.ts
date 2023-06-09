import {
  TData,
  IComponentDefinitionArgs,
  Component,
} from '@core/components/component';
import { ComponentType } from '@core/components/component-type';
import type { Templates } from '@core/parsers/html';
import { ref$, readonly } from '@core/reactivity/ref';
import { ReadonlyRef } from '@core/reactivity/ref/readonly.ref';
import { AnyComponent } from '@core/render/html/@types/any-component';
import { Observable, isObservable, map, filter } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ToReadonlyRef<T> = T extends Observable<infer V>
  ? ReadonlyRef<V>
  : ReadonlyRef<T>;

type TPropsAccessors<TObj> = {
  [Key in keyof TObj]: ToReadonlyRef<TObj[Key]>;
};

export interface ISetupContext<TProps> {
  props: TPropsAccessors<TProps>;
}

export type CustomTemplate = string | AnyComponent[] | Templates;

export type SetupFn<TProps> = (context: ISetupContext<TProps>) => void;
export interface ICustomTemplateComponentDefinitionArgs<
  TProps extends TData = TData,
> extends Omit<IComponentDefinitionArgs<TProps>, 'type'> {
  setup?: SetupFn<TProps>;
  template: () => CustomTemplate | Promise<CustomTemplate>;
}

export class CustomTemplateComponent<
  TProps extends TData = TData,
> extends Component<TProps> {
  private setupFn?: SetupFn<TProps>;

  private $template = ref$<CustomTemplate>();

  get template() {
    return this.$template.pipe(filter((x): x is CustomTemplate => x != null));
  }

  propsAccessors$ = ref$(
    this.props$.pipe(
      map((ps) => {
        const resultProps: Record<string, Observable<unknown>> = {};
        Object.keys(ps).forEach((pk) => {
          const item = ps[pk];
          if (isObservable(item)) {
            resultProps[pk] = ref$(item);
          } else {
            resultProps[pk] = readonly(ref$(item));
          }
        });
        return resultProps as TPropsAccessors<TProps>;
      }),
    ),
  );

  constructor(args: ICustomTemplateComponentDefinitionArgs<TProps>) {
    super({ ...args, type: ComponentType.CustomTemplate });
    this.setupFn = args.setup;
    Promise.resolve(args.template()).then((t) => {
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

