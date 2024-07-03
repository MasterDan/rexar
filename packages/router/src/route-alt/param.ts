import { stringTools } from '@rexar/tools';
import type { RouteNodeNext } from '.';

export enum ParamKind {
  Optional,
  Required,
  Asterisk,
}

export class ParamNext {
  constructor(
    public name: string,
    public kind: ParamKind,
    public validator?: (arg: string) => boolean,
  ) {}

  static tryParse(str: string): RouteNodeNext {
    if (str.startsWith(':')) {
      return new ParamNext(str.slice(1).trimEnd(), ParamKind.Required);
    }
    if (str.startsWith('?')) {
      return new ParamNext(str.slice(1).trimEnd(), ParamKind.Optional);
    }
    if (str.startsWith('*')) {
      return new ParamNext(str.slice(1).trimEnd(), ParamKind.Asterisk);
    }
    return str;
  }

  private val?: string;

  get placeholder() {
    const prefix = (() => {
      switch (this.kind) {
        case ParamKind.Optional:
          return '?';
        case ParamKind.Asterisk:
          return '*';
        case ParamKind.Required:
          return ':';
        default:
          throw new Error(`Unknown param kind: ${this.kind}`);
      }
    })();
    return `${prefix}${this.name}`;
  }

  get value() {
    return this.val;
  }

  set value(val: string | undefined) {
    const value = String(val);
    if (this.validator && !this.validator(value)) {
      throw new Error(`Invalid value for param "${this.name}": ${val}`);
    }
    this.val = value;
  }

  clone() {
    const param = new ParamNext(this.name, this.kind, this.validator);
    param.value = this.value;
    return param;
  }

  compareWith(other: RouteNodeNext) {
    if (other instanceof ParamNext) {
      return this.name === other.name && this.kind === other.kind;
    }
    return !stringTools.isNullOrWhitespace(other);
  }

  static compareNodes(a: RouteNodeNext, b: RouteNodeNext) {
    if (a instanceof ParamNext) {
      return a.compareWith(b);
    }
    if (b instanceof ParamNext) {
      return b.compareWith(a);
    }
    return a === b;
  }
}

