import { bindingContextToken } from '@reactivity/module';
import { RefBase } from './base.ref';

export class TrackableRef<T> extends RefBase<T> {
  context = bindingContextToken.resolve();

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
