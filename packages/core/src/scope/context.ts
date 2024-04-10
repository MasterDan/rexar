export class RenderContext {
  constructor(private vault: Map<symbol, unknown> = new Map()) {}

  provide<T>(key: symbol, value: T) {
    this.vault.set(key, value);
  }

  inject<T>(key: symbol, defaultVal: T): T;
  inject<T>(key: symbol, defaultVal?: T): T | undefined {
    const value = this.vault.get(key) as T | undefined;
    return value ?? defaultVal;
  }

  createChildContext() {
    const newVault = new Map<symbol, unknown>([...this.vault]);
    return new RenderContext(newVault);
  }
}

