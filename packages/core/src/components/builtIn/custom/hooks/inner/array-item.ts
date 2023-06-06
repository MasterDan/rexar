export class ArrayItem<TItem> {
  key: string | number | symbol;

  constructor(
    public value: TItem,
    public index: number,
    keyGetter: (item: TItem, index: number) => string | number | symbol,
  ) {
    this.key = keyGetter(value, index);
  }
}
