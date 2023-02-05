import { Observable } from 'rxjs';
import { TrackableRef } from './trackable.ref';

export class ReadonlyRef<T> extends TrackableRef<T> {
  constructor(source$: Observable<T>, fallack: T) {
    super(fallack);
    super.next(fallack);
    source$.subscribe((s) => {
      super.next(s);
    });
  }
}
