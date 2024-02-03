import { AnyRecord } from '@rexar/tools';

export function detectChanges<T extends object>(
  arg: T,
  onChange: () => void,
): T {
  return new Proxy<T>(arg, {
    set: (target, prop, value) => {
      (target as AnyRecord<string | symbol>)[prop] = value;
      onChange();
      return true;
    },
    get: (target, key) => {
      if (typeof (target as AnyRecord<string | symbol>)[key] === 'function') {
        return new Proxy((target as AnyRecord<string | symbol>)[key], {
          apply: (targetFn, _, argumentsList) => {
            const result = Reflect.apply(targetFn, target, argumentsList);
            onChange();
            return result;
          },
        });
      }
      if (
        key in target &&
        (target as AnyRecord<string | symbol>)[key] != null &&
        typeof (target as AnyRecord<string | symbol>)[key] === 'object'
      ) {
        return detectChanges(
          (target as AnyRecord<string | symbol>)[key],
          onChange,
        );
      }
      return (target as AnyRecord<string | symbol>)[key];
    },
  });
}

export function readonly<T extends object>(arg: T): T {
  return new Proxy<T>(arg, {
    set: (_, prop) => {
      throw new Error(`Cannot set prop "${String(prop)}": target is readonly`);
    },
    get: (target, key) => {
      if (typeof (target as AnyRecord<string | symbol>)[key] === 'function') {
        return new Proxy((target as AnyRecord<string | symbol>)[key], {
          apply: () => {
            throw new Error('Cannot call method on readonly target');
          },
        });
      }
      if (
        key in target &&
        (target as AnyRecord<string | symbol>)[key] != null &&
        typeof (target as AnyRecord<string | symbol>)[key] === 'object'
      ) {
        return readonly((target as AnyRecord<string | symbol>)[key]);
      }
      return (target as AnyRecord<string | symbol>)[key];
    },
  });
}
