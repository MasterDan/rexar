import { MaybeObservable } from '@core/@types/MaybeObservable';
import { ref$ } from '@core/reactivity/ref';
import { Ref } from '@core/reactivity/ref/ref';
import { isObservable, Observable } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TData = Record<string, MaybeObservable<any> | undefined>;

type PropValue<T> = T extends Observable<infer R> ? R : T;

export interface IComponentDefinitionArgs<TProps extends TData = TData> {
  id?: string;
  name?: string;
  props: () => TProps;
}

export class Component<TProps extends TData = TData> {
  id?: string;

  name?: string;

  protected props$: Ref<TProps>;

  constructor({ props, name, id }: IComponentDefinitionArgs<TProps>) {
    this.id = id;
    this.name = name;
    this.props$ = ref$<TProps>(props());
  }

  bindProp<T extends keyof TProps>(
    key: T,
    value: MaybeObservable<PropValue<TProps[T]>>,
  ) {
    if (this.props$.val == null) {
      this.props$.val = {} as TProps;
    }
    if (isObservable(this.props$.val[key])) {
      if (isObservable(value)) {
        value.subscribe((v) => {
          (this.props$.val as TProps)[key].next(v);
        });
      } else {
        this.props$.val[key].next(value);
      }
    } else if (isObservable(value)) {
      value.subscribe((v) => {
        (this.props$.val as TProps)[key] = v;
      });
    } else {
      this.props$.val[key] = value;
    }
  }

  bindProps(props: TProps) {
    this.props$.val = props;
  }

  getProp<T extends keyof TProps>(key: T) {
    return this.props$.val[key];
  }
}
