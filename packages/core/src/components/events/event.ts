export class EventEmitter<T = void> {
  constructor(private fn: (arg: T) => void = () => {}) {}

  emit(arg: T) {
    this.fn(arg);
  }
}
