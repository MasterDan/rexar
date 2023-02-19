import { MaybeObservable } from '@core/@types/MaybeObservable';
import { readonly, ref$ } from '@core/reactivity/ref';
import { isObservable, Observable } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TData = Record<string, MaybeObservable<any> | undefined>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExactlyObservable<T> = T extends Observable<any> ? T : Observable<T>;

type PropValue<T> = T extends Observable<infer R> ? R : T;

type TPropsAccessors<TObj> = {
  [Key in keyof TObj]: ExactlyObservable<TObj[Key]>;
};

interface ISetupContext<TProps> {
  props: TPropsAccessors<TProps>;
}

type SetupFn<TProps> = (context: ISetupContext<TProps>) => void;

export interface IComponentDefinitionArgs<TProps extends TData = TData> {
  id?: string;
  name?: string;
  props?: TProps;
  setup?: SetupFn<TProps>;
}

export class Component<TProps extends TData = TData> {
  id?: string;

  // may be don't need
  name?: string;

  /** @todo make this reactive */
  protected props?: TProps;

  protected setup?: SetupFn<TProps>;

  constructor({
    props,
    setup,
    name,
    id,
  }: IComponentDefinitionArgs<TProps> = {}) {
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
