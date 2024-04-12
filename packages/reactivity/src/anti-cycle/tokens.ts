import type { trackingScope } from '@reactivity/computed';
import type { toRef } from '../ref/tools';

export class Token<T> {
  private $value: T | undefined;

  get value(): T {
    if (this.$value == null) {
      throw new Error('Value must be provided');
    }
    return this.$value;
  }

  set value(val: T) {
    this.$value = val;
  }
}

export const toRefToken = new Token<typeof toRef>();

export const trackingScopeToken = new Token<typeof trackingScope>();
