export class Lazy<T> {
  constructor(private create: () => T) {}
}

