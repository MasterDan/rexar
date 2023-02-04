import { container } from 'tsyringe';
import { BindingContext } from '../computed/binding-context';
import { Ref } from './ref';

export class TrackableRef<T> extends Ref<T> {
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
