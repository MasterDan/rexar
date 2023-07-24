import { Observable } from 'rxjs';
import { ReadonlyRef } from './readonly.ref';

export class WritableReadonlyRef<T> extends ReadonlyRef<T> {
  constructor(
    source$: Observable<T>,
    fallack: T,
    private setter: (value: T) => void,
  ) {
    super(source$, fallack);
  }

  set value(v: T) {
    this.setter(v);
  }

  get value() {
    return super.value;
  }
}