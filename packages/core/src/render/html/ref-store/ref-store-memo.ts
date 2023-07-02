import { RefStore } from './ref-store';

export class RefStoreMemo {
  scopeKey: symbol | undefined;

  mustRememberScope = false;

  constructor(private refStore: RefStore) {}

  rememberScope() {
    // console.log('remember scope called');
    this.mustRememberScope = this.refStore.currentScopeKey == null;
    if (!this.mustRememberScope) {
      //   console.log('remember: scope is Ok');
    }
    this.scopeKey = this.refStore.currentScopeKey ?? this.scopeKey;
    if (this.scopeKey != null && this.mustRememberScope) {
      this.refStore.restoreScope(this.scopeKey);
      //   console.log('scope successfully remembered', this.scopeKey);
    }
  }

  forgetScope() {
    // console.log('forget scope called', this.scopeKey);
    // if (!this.mustRememberScope) {
    //   console.log('forget: scope is Ok', this.scopeKey);
    // }
    if (
      this.scopeKey != null &&
      this.scopeKey === this.refStore.currentScopeKey &&
      this.mustRememberScope
    ) {
      this.refStore.endScope();
      this.mustRememberScope = false;
      //   console.log('scope is forgotten', this.scopeKey);
    }
  }
}
