import { RefStore } from './ref-store';

export class RefStoreMemo {
  scopeKey: symbol | undefined;

  mustRememberScope = false;

  constructor(private refStore: RefStore) {}

  rememberScope() {
    this.mustRememberScope = this.refStore.currentScopeKey == null;

    this.scopeKey = this.refStore.currentScopeKey ?? this.scopeKey;
    if (this.scopeKey != null && this.mustRememberScope) {
      this.refStore.restoreScope(this.scopeKey);
    }
  }

  forgetScope() {
    if (
      this.scopeKey != null &&
      this.scopeKey === this.refStore.currentScopeKey &&
      this.mustRememberScope
    ) {
      this.refStore.endScope();
      this.mustRememberScope = false;
    }
  }
}
