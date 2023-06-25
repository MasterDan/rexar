import { MaybeObservable } from '@core/@types/MaybeObservable';
import { ref$, Ref } from '@rexar/reactivity';
import { isObservable, Observable } from 'rxjs';
import { ComponentType } from './component-type';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TData = Record<string, MaybeObservable<any> | undefined>;

type PropValue<T> = T extends Observable<infer R> ? R : T;

export interface IComponentDefinitionArgs<TProps extends TData = TData> {
  id?: string;
  type: ComponentType;
  props: () => TProps;
}

export class Component<TProps extends TData = TData> {
  id?: string;

  type: ComponentType;

  preventTransformation = false;

  protected props$: Ref<TProps>;

  constructor({ props, type, id }: IComponentDefinitionArgs<TProps>) {
    this.id = id;
    this.type = type;
    this.props$ = ref$<TProps>(props());
  }

  bindProp<T extends keyof TProps>(
    key: T,
    value: MaybeObservable<PropValue<TProps[T]>>,
  ) {
    if (isObservable(this.props$.value[key])) {
      if (isObservable(value)) {
        value.subscribe((v) => {
          this.props$.value[key].next(v);
        });
      } else {
        this.props$.value[key].next(value);
      }
    } else if (isObservable(value)) {
      value.subscribe((v) => {
        this.props$.patch((props) => {
          props[key] = v;
        });
      });
    } else {
      this.props$.patch((props) => {
        props[key] = value;
      });
    }
  }

  bindProps(props: TProps) {
    this.props$.value = props;
  }

  getProp<T extends keyof TProps>(key: T) {
    return this.props$.value[key];
  }
}
