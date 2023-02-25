import {
  TData,
  IComponentDefinitionArgs,
  Component,
} from '@core/components/component';
import { ref$, readonly } from '@core/reactivity/ref';
import { AnyComponent } from '@core/render/html/@types/any-component';
import { Observable, isObservable } from 'rxjs';

type SetupFn<TProps> = (context: ISetupContext<TProps>) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExactlyObservable<T> = T extends Observable<any> ? T : Observable<T>;

type TPropsAccessors<TObj> = {
  [Key in keyof TObj]: ExactlyObservable<TObj[Key]>;
};

interface ISetupContext<TProps> {
  props: TPropsAccessors<TProps>;
}

export interface ICustomComponentDefinitionArgs<TProps extends TData = TData>
  extends IComponentDefinitionArgs<TProps> {
  setup?: SetupFn<TProps>;
  template: string | AnyComponent[];
}

export class CustomComponent<
  TProps extends TData = TData,
> extends Component<TProps> {
  private setup?: SetupFn<TProps>;

  override name = 'template';

  template: string | AnyComponent[];

  constructor(args: ICustomComponentDefinitionArgs<TProps>) {
    super(args);
    this.setup = args.setup;
    this.template = args.template;
    if (this.setup == null) {
      return;
    }

    const propsForSetup: Record<string, Observable<unknown>> = {};
    if (this.props) {
      Object.keys(this.props).forEach((pk) => {
        const item = (this.props as TProps)[pk];
        if (isObservable(item)) {
          propsForSetup[pk] = ref$(item);
        } else {
          propsForSetup[pk] = readonly(ref$(item));
        }
      });
    }

    const context: ISetupContext<TProps> = {
      props: propsForSetup as TPropsAccessors<TProps>,
    };

    this.setup(context);
  }
}
