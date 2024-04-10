export class RenderContext {
  private vault: Map<symbol, unknown> = new Map();

  constructor(private parent?: RenderContext) {}

  provide<T>(key: symbol, value: T) {
    this.vault.set(key, value);
  }

  inject<T>(key: symbol): T | undefined;
  inject<T>(key: symbol, defaultVal: T): T;
  inject<T>(key: symbol, defaultVal?: T): T | undefined {
    const value =
      (this.vault.get(key) as T | undefined) ?? this.parent?.inject(key);
    return value ?? defaultVal;
  }

  createChildContext() {
    return new RenderContext(this);
  }
}

