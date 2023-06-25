import { container } from 'tsyringe';
import { BindingContext } from '../computed/binding-context';
import { RefBase } from './base.ref';

export class TrackableRef<T> extends RefBase<T> {
  context = container.resolve(BindingContext);

  track() {
    if (this.context.isValid) {
      this.context.track(this);
    }
  }

  get value(): T {
    this.track();
    return super.value;
  }
}
