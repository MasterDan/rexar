import { AnyRecord, stringTools } from '@rexar/tools';
import { queryParamsFromString, queryParamsToString } from './query-params';

export class Path {
  queryParams?: AnyRecord<string>;

  constructor(private nodes: string[]) {
    if (nodes.length > 1) {
      for (let i = nodes.length - 2; i >= 0; i -= 1) {
        const node = nodes[i];
        const nextNode = nodes[i + 1];
        if (node.startsWith('?') && !nextNode.startsWith('?')) {
          throw new Error(
            `Cannot create path "${this.value}". Optional params must be at the end of the path.`,
          );
        }
      }
    }
    if (nodes.length > 0) {
      const lastNode = nodes[nodes.length - 1];
      const [node, params] = queryParamsFromString(lastNode);
      nodes[nodes.length - 1] = node;
      if (Object.keys(params).length > 0) {
        this.queryParams = params;
      }
    }
  }

  static fromString(str: string) {
    if (stringTools.isNullOrWhitespace(str)) {
      return new Path([]);
    }
    return new Path(
      str.split('/').filter((i) => !stringTools.isNullOrWhitespace(i)),
    );
  }

  combineWith(other: Path) {
    return new Path(this.nodes.concat(other.nodes));
  }

  get value() {
    if (this.nodes.length === 0) {
      return '/';
    }
    return `/${this.nodes.join('/')}${queryParamsToString(
      this.queryParams ?? {},
    )}`;
  }

  get size() {
    return this.nodes.length;
  }

  includes(other: Path) {
    let equals = true;
    if (this.size < other.size) {
      return false;
    }
    for (let i = 0; i < this.size; i += 1) {
      const node = this.nodes[i];
      const otherNode = other.nodes[i];
      if (otherNode == null && !node.startsWith('?')) {
        equals = false;
        break;
      }
      if (
        !node.startsWith(':') &&
        !node.startsWith('?') &&
        node !== otherNode
      ) {
        equals = false;
        break;
      }
    }
    return equals;
  }

  matches(str: string) {
    const path = Path.fromString(str);
    return this.includes(path);
  }

  get params() {
    const required = this.nodes
      .filter((node) => node.startsWith(':'))
      .map((node) => node.slice(1));
    const optional = this.nodes
      .filter((node) => node.startsWith('?'))
      .map((node) => node.slice(1));
    return { required, optional };
  }

  withParams(params: Record<string, unknown>) {
    const { required, optional } = this.params;
    const filledParams: Record<string, string> = {};
    required.forEach((param) => {
      if (params[param] == null) {
        throw new Error(`Required parameter "${param}" is missing`);
      }
      const val = String(params[param]);
      if (val != null && typeof val === 'string') {
        filledParams[param] = val;
      } else {
        throw new Error(`Required parameter "${param}" is not a string`);
      }
    });
    optional.forEach((param) => {
      if (params[param] != null) {
        const val = String(params[param]);
        if (val != null && typeof val === 'string') {
          filledParams[param] = val;
        } else {
          throw new Error(`Optional parameter "${param}" is not a string`);
        }
      }
    });
    const nodes = this.nodes
      .map((node) => {
        if (node.startsWith(':')) {
          return filledParams[node.slice(1)];
        }
        if (node.startsWith('?')) {
          return filledParams[node.slice(1)] ?? undefined;
        }
        return node;
      })
      .filter((node): node is string => node != null);
    return new Path(nodes);
  }
}

