import { toRef } from '@reactivity/ref/tools';
import { trackingScope } from '@reactivity/computed';
import { toRefToken, trackingScopeToken } from './tokens';

export function initCycleDependencies() {
  toRefToken.value = toRef;
  trackingScopeToken.value = trackingScope;
}
