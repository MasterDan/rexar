import { toRef } from '@reactivity/ref/tools';
import { trackingScope } from '@reactivity/computed';
import { toRefProvider, trackingScopeProvider } from './tokens';

export function initCycleDependencies() {
  toRefProvider.value = toRef;
  trackingScopeProvider.value = trackingScope;
}
