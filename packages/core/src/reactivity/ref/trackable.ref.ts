import { container } from 'tsyringe';
import { BindingContext } from '../computed/binding-context';
import { RefBase } from './base.ref';

export class TrackableRef<T> extends RefBase<T> {
  track() {
    const context = container.resolve(BindingContext);
    if (context.isValid) {
      context.track(this);
    }
  }

  get val(): T {
    this.track();
    return super.value;
  }
}
