export class Scope {
  key: symbol;

  parentKey: symbol | undefined;

  get name() {
    return this.key.description ?? 'Unnamed Scope';
  }

  constructor(name?: string) {
    this.key = Symbol(name);
  }

  createChild(name?: string) {
    const child = new Scope(name);
    child.parentKey = this.key;
    return child;
  }

  createBrother(name?: string) {
    const child = new Scope(name);
    child.parentKey = this.parentKey;
    return child;
  }
}
