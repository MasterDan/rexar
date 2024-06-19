export class Path {
  constructor(private nodes: string[]) {}

  static fromString(str: string) {
    return new Path(str.split('/'));
  }

  combineWith(other: Path) {
    return new Path(this.nodes.concat(other.nodes));
  }

  get value() {
    return this.nodes.join('/');
  }
}

