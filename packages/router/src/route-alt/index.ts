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

  clone() {
    const param = new ParamNext(this.name, this.kind, this.validator);
    param.value = this.value;
    return param;
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

  get params(): ParamNext[] {
    return this.path.filter((v): v is ParamNext => v instanceof ParamNext);
  }

  get paramsUnused(): ParamNext[] {
    return this.params.filter((v) => v.name.length > 0 && v.value == null);
  }

  setParam(predicate: (param: ParamNext) => boolean, value: string) {
    const param = this.params.find(predicate);
    if (param == null) {
      throw new Error(`Param not found: ${predicate.toString()}`);
    }
    param.value = value;
  }

  get value() {
    return this.path
      .map((v) => {
        if (v instanceof ParamNext) {
          if (v.value == null) {
            throw new Error(`Param "${v.name}" is not set`);
          }
          return v.value;
        }
        return v;
      })
      .filter((v): v is string => v != null)
      .join('/');
  }

  get pattern() {
    return this.path
      .map((v) => {
        if (v instanceof ParamNext) {
          return v.placeholder;
        }
        return v;
      })
      .join('/');
  }

  clone() {
    return new RouteNext(
      this.path.map((v) => (v instanceof ParamNext ? v.clone() : v)),
    );
  }
}

