export class LogScope {
  key: symbol;

  parentKey: symbol | undefined;

  get name() {
    return this.key.description ?? 'Unnamed Scope';
  }

  constructor(name?: string) {
    this.key = Symbol(name);
  }

  createChild(name?: string) {
    const child = new LogScope(name);
    child.parentKey = this.key;
    return child;
  }

  createSibling(name?: string) {
    const child = new LogScope(name);
    child.parentKey = this.parentKey;
    return child;
  }
}
