import {
  TData,
  IComponentDefinitionArgs,
  Component,
} from '@core/components/component';
import { ref$, readonly } from '@core/reactivity/ref';
import { AnyComponent } from '@core/render/html/@types/any-component';
import { HooksLab } from '@core/tools/hooks';
import { Observable, isObservable } from 'rxjs';
import type { CustomComponentHooks } from './custom-component-hooks';

type SetupFn<TProps> = (context: ISetupContext<TProps>) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExactlyObservable<T> = T extends Observable<any> ? T : Observable<T>;

type TPropsAccessors<TObj> = {
  [Key in keyof TObj]: ExactlyObservable<TObj[Key]>;
};

export interface ISetupContext<TProps> {
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
  private setupFn?: SetupFn<TProps>;

  template: string | AnyComponent[];

  constructor(args: ICustomComponentDefinitionArgs<TProps>) {
    super(args);
    this.setupFn = args.setup;
    this.template = args.template;
    if (this.name == null) {
      throw new Error('Custom components must have unique string names!');
    }
  }

  setup(): HooksLab<ISetupContext<TProps>, void, CustomComponentHooks> | null {
    if (this.setupFn == null) {
      return null;
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
    const hooksLab = new HooksLab<
      ISetupContext<TProps>,
      void,
      CustomComponentHooks
    >();

    hooksLab.callFunction(this.setupFn, context);
    return hooksLab;
  }
}
