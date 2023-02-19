import { MaybeObservable } from '@core/@types/MaybeObservable';
import {
  TData,
  IComponentDefinitionArgs,
  Component,
} from '@core/components/component';
import { ref$, readonly } from '@core/reactivity/ref';
import {
  ISetupContext,
  TPropsAccessors,
  PropValue,
} from 'packages/core/dist/types';
import { Observable, isObservable } from 'rxjs';

export class CustomComponent<
  TProps extends TData = TData,
> extends Component<TProps> {
  constructor(args: IComponentDefinitionArgs<TProps> = {}) {
    super();
    const { props, setup, name, id } = args;
    this.id = id;
    this.name = name;
    this.props = props;
    this.setup = setup;

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

  bindProp<T extends keyof TProps>(
    key: T,
    value: MaybeObservable<PropValue<TProps[T]>>,
  ) {
    if (this.props == null) {
      this.props = {} as TProps;
    }
    if (isObservable(this.props[key])) {
      if (isObservable(value)) {
        value.subscribe((v) => {
          (this.props as TProps)[key].next(v);
        });
      } else {
        this.props[key].next(value);
      }
    } else if (isObservable(value)) {
      value.subscribe((v) => {
        (this.props as TProps)[key] = v;
      });
    } else {
      this.props[key] = value;
    }
  }

  bindProps(props: TProps) {
    this.props = props;
  }

  getProp<T extends keyof TProps>(key: T) {
    return this.props ? this.props[key] : null;
  }
}
