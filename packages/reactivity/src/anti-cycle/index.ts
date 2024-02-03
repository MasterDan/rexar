import { toRef } from '@reactivity/ref/tools';
import { trackingScope } from '@reactivity/computed';
import { toRefProvider, trackingScopeProvider } from './anti-cycle';

export function initCycleDependencies() {
  toRefProvider.value = toRef;
  trackingScopeProvider.value = trackingScope;
}
