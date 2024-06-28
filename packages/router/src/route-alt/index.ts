/* eslint-disable max-classes-per-file */

export enum ParamKind {
  Optional,
  Required,
  Asterisk,
}

export class Param {
  constructor(
    public name: string,
    kind: ParamKind,
    public validator?: (arg: string) => boolean,
  ) {}

  static tryParse(str: string): RouteNode {
    if (str.startsWith(':')) {
      return new Param(str.slice(1).trimEnd(), ParamKind.Required);
    }
    if (str.startsWith('?')) {
      return new Param(str.slice(1).trimEnd(), ParamKind.Optional);
    }
    if (str.startsWith('*')) {
      return new Param(str.slice(1).trimEnd(), ParamKind.Asterisk);
    }
    return str;
  }

  private val?: string;

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
}

export type RouteNode = string | Param;

export class Route {
  constructor(public path: RouteNode[]) {}

  static fromString(
    str: string,
    validators: Record<string, (arg: string) => boolean> = {},
  ) {
    const nodes = str.split('/').map((s) => {
      const param = Param.tryParse(s);
      if (param instanceof Param) {
        param.validator = validators[param.name];
        return param;
      }
      return s;
    });
    return new Route(nodes);
  }
}

