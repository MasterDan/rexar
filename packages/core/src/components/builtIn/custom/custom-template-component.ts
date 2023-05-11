import {
  TData,
  IComponentDefinitionArgs,
  Component,
} from '@core/components/component';
import { ref$, readonly } from '@core/reactivity/ref';
import { ReadonlyRef } from '@core/reactivity/ref/readonly.ref';
import { AnyComponent } from '@core/render/html/@types/any-component';
import { Observable, isObservable, map } from 'rxjs';

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

type SetupFn<TProps> = (context: ISetupContext<TProps>) => void;
export interface ICustomTemplateComponentDefinitionArgs<
  TProps extends TData = TData,
> extends IComponentDefinitionArgs<TProps> {
  setup?: SetupFn<TProps>;
  template: string | AnyComponent[];
}

export const customTemplateComponentName = 'custom-template-component';

export class CustomTemplateComponent<
  TProps extends TData = TData,
> extends Component<TProps> {
  private setupFn?: SetupFn<TProps>;

  template: string | AnyComponent[];

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
    super(args);
    this.setupFn = args.setup;
    this.template = args.template;
    this.name = customTemplateComponentName;
  }

  setup() {
    if (this.setupFn == null) {
      return;
    }
    if (this.propsAccessors$.val == null) {
      return;
    }
    this.setupFn({
      props: this.propsAccessors$.val,
    });
  }
}
