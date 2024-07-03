export type QueryParamsRecord = Record<string, string | undefined>;

export class QueryParams {
  static stringify<TQuery extends QueryParamsRecord>(query: TQuery): string {
    const keys = Object.keys(query);
    if (keys.length === 0) {
      return '';
    }
    const queryString = keys
      .map((key) => {
        const value = query[key];
        if (value == null) {
          return '';
        }
        return `${key}=${encodeURIComponent(value)}`;
      })
      .join('&');
    return `?${queryString}`;
  }

  static parse(node: string): [string, QueryParamsRecord] {
    const query: QueryParamsRecord = {};
    const [nodeBody, queryString] = node.split('?', 2);
    if (queryString == null) {
      return [nodeBody, query];
    }
    const pairs = queryString.split('&');
    pairs.forEach((pair) => {
      const [key, value] = pair.split('=');
      query[key] = decodeURIComponent(value);
    });
    return [nodeBody, query];
  }
}

