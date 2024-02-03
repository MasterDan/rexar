import { MaybeObservable } from '@rexar/reactivity';
import { defineComponent } from '@core/component';
import { h, fragment } from '@rexar/jsx';
import { getPatch } from 'fast-array-diff';
import { isObservable } from 'rxjs';
import { Comment } from '../comment';
import { ArrayItem } from './array-item';
import { EachComponent, KeyFactory } from './@types';

export type ForEachState<T> = {
  array: ArrayItem<T>[];
  anchorStart?: JSX.Element;
  each?: EachComponent<T>;
};

export function useFor<T>(
  array: MaybeObservable<T[]>,
  keyFactory: KeyFactory<T>,
) {
  let ComponentsArray: ArrayItem<T>[] = [];
  let anchorStart: JSX.Element | undefined;
  let each: EachComponent<T> | undefined;

  const setArray = (value: T[]) => {
    if (anchorStart == null) {
      throw new Error('Must provide start anchor');
    }
    if (each == null) {
      throw new Error('Must provide "Each" component before set array');
    }
    const newArray = value.map(
      (item, index) => new ArrayItem(item, keyFactory(item, index), index),
    );

    if (ComponentsArray.length === 0) {
      let anchor = anchorStart;
      newArray.forEach((item) => {
        const currentAnchor = anchor;
        anchor = item.render(each!).after(currentAnchor);
      });
      ComponentsArray = newArray;
    } else {
      getPatch(ComponentsArray, newArray, (a, b) => a.key === b.key).forEach(
        (p) => {
          if (p.type === 'remove') {
            p.items.forEach((item) => {
              item.remove();
              ComponentsArray.splice(item.indexRef.value, 1);
              ComponentsArray.forEach((i, index) => {
                i.indexRef.value = index;
              });
            });
          } else {
            let anchor =
              p.newPos === 0
                ? anchorStart
                : ComponentsArray.find((_, n) => n === p.newPos - 1)?.endAnchor;
            if (anchor == null) {
              throw new Error('Cannot find anchor to patch');
            }
            p.items.forEach((item) => {
              if (anchor == null) {
                throw new Error('Cannot find anchor to patch');
              }
              const currentAnchor = anchor;
              anchor = item.render(each!).after(currentAnchor);
              ComponentsArray.splice(item.indexRef.value, 0, item);
              ComponentsArray.forEach((i, index) => {
                i.indexRef.value = index;
              });
            });
          }
        },
      );
    }
  };

  const For = defineComponent<{
    each: EachComponent<T>;
  }>(({ each: eachComponent }) => {
    const anchorStartComponent = <Comment text="foreach-anchor"></Comment>;
    anchorStart = anchorStartComponent;
    each = eachComponent;
    const result = <>{anchorStartComponent}</>;
    if (isObservable(array)) {
      array.subscribe((a) => {
        setArray(a);
      });
    } else {
      setArray(array);
    }
    return result;
  });

  return For;
}
