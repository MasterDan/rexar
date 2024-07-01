/* eslint-disable max-classes-per-file */

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
}

export type RouteNodeNext = string | ParamNext;

export class RouteNext {
  constructor(public path: RouteNodeNext[]) {
    if (path.length === 0) {
      return;
    }
    // #region validation
    const lastItemIndex = path.length - 1;
    path.forEach((v, i) => {
      if (
        v instanceof ParamNext &&
        v.kind === ParamKind.Asterisk &&
        i !== lastItemIndex
      ) {
        throw new Error(`Asterisk param must be the last node in the path.`);
      }
    });
    const last = path[lastItemIndex];
    if (last instanceof ParamNext && last.kind === ParamKind.Asterisk) {
      const optionalParams = path.filter(
        (v) => v instanceof ParamNext && v.kind === ParamKind.Optional,
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
      if (node instanceof ParamNext && !(nextNode instanceof ParamNext)) {
        throw new Error(
          `Cannot create route "${this.path.join(
            '/',
          )}". Params must be at the end of the path.`,
        );
      }
      if (node instanceof ParamNext) {
        if (
          node.kind === ParamKind.Optional &&
          (typeof nextNode === 'string' ||
            (nextNode instanceof ParamNext &&
              nextNode.kind === ParamKind.Required))
        ) {
          throw new Error(
            `Cannot create route "${this.path.join(
              '/',
            )}". Optional params must be at the end of the path.`,
          );
        }
      }
    }
    // #endregion
  }

  static fromString(
    str: string,
    validators: Record<string, (arg: string) => boolean> = {},
  ) {
    const nodes = str.split('/').map((s) => {
      const param = ParamNext.tryParse(s);
      if (param instanceof ParamNext) {
        param.validator = validators[param.name];
        return param;
      }
      return s;
    });
    return new RouteNext(nodes);
  }
}

