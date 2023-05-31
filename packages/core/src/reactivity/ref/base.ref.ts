import { BehaviorSubject } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class RefBase<T = any> extends BehaviorSubject<T> {
  key = Symbol('ref');
}
