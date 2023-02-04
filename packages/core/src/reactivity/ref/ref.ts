import { BehaviorSubject } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class Ref<T = any> extends BehaviorSubject<T> {
  key = Symbol('ref');
  abstract get val(): T;
}
