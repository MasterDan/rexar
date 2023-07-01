export class Lazy<T> {
  constructor(private resolve: () => T) {}

  private val: T | undefined;

  get value(): T {
    if (this.val == null) {
      this.val = this.resolve();
    }
    return this.val;
  }
}
