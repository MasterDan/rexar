import { AnyRecord } from '@rexar/tools';

export function queryParamsToString<TQuery extends AnyRecord<string>>(
  query: TQuery,
) {
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

export function queryParamsFromString(
  node: string,
): [string, AnyRecord<string>] {
  const query: AnyRecord<string> = {};
  // eslint-disable-next-line @typescript-eslint/naming-convention
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

