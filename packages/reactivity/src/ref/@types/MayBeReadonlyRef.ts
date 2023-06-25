import { ReadonlyRef } from '../readonly.ref';
import { Ref } from '../ref';

export type MayBeReadonlyRef<T> = Ref<T> | ReadonlyRef<T>;
