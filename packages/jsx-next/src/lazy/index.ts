export class Lazy<T> {
  constructor(private create: () => T) {}

  private innerValue?: T;

  get value(): T {
    this.innerValue ??= this.create();
    return this.innerValue;
  }
}

