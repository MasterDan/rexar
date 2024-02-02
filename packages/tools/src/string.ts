function isNullOrEmpty<T extends string | null | undefined>(str: T) {
  return str == null || str === '';
}

function isNullOrWhitespace<T extends string | null | undefined>(str: T) {
  return str == null || str.trim() === '';
}

export const stringTools = { isNullOrEmpty, isNullOrWhitespace };
