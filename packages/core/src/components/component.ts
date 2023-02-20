import { MaybeObservable } from '@core/@types/MaybeObservable';
import { isObservable, Observable } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TData = Record<string, MaybeObservable<any> | undefined>;

type PropValue<T> = T extends Observable<infer R> ? R : T;

export interface IComponentDefinitionArgs<TProps extends TData = TData> {
  id?: string;
  name?: string;
  props?: TProps;
}

export class Component<TProps extends TData = TData> {
  id?: string;

  // may be don't need
  name?: string;

  /** @todo make this reactive */
  protected props?: TProps;

  constructor({ props, name, id }: IComponentDefinitionArgs<TProps> = {}) {
    this.id = id;
    this.name = name;
    this.props = props;
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
