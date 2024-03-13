import { Observable } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObservable = Observable<any>;

export type MaybeObservable<T> = T | Observable<T>;
