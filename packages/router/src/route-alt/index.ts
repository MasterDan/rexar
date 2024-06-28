/* eslint-disable max-classes-per-file */

export enum ParamKind {
  Optional,
  Required,
  Asterisk,
}

export class Param {
  constructor(
    public name: string,
    public kind: ParamKind,
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
  constructor(public path: RouteNode[]) {
    if (path.length === 0) {
      return;
    }
    const lastItemIndex = path.length - 1;
    path.forEach((v, i) => {
      if (
        v instanceof Param &&
        v.kind === ParamKind.Asterisk &&
        i !== lastItemIndex
      ) {
        throw new Error(`Asterisk param must be the last node in the path.`);
      }
    });
    const last = path[lastItemIndex];
    if (last instanceof Param && last.kind === ParamKind.Asterisk) {
      const optionalParams = path.filter(
        (v) => v instanceof Param && v.kind === ParamKind.Optional,
      );
      if (optionalParams.length > 0) {
        throw new Error(
          `Asterisk param cannot be followed by optional params.`,
        );
      }
    }
    if (path.length < 2) {
      return;
    }
    for (let i = path.length - 2; i >= 0; i -= 1) {
      const node = path[i];
      const nextNode = path[i + 1];
      if (node instanceof Param && !(nextNode instanceof Param)) {
        throw new Error(
          `Cannot create route "${this.path.join(
            '/',
          )}". Params must be at the end of the path.`,
        );
      }
      if (node instanceof Param) {
        if (
          node.kind === ParamKind.Optional &&
          (typeof nextNode === 'string' ||
            (nextNode instanceof Param && nextNode.kind === ParamKind.Required))
        ) {
          throw new Error(
            `Cannot create route "${this.path.join(
              '/',
            )}". Optional params must be at the end of the path.`,
          );
        }
      }
    }
  }

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

