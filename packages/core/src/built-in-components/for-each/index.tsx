import {
  ValueOrObservableOrGetter,
  ref,
  toObservable,
} from '@rexar/reactivity';
import { defineComponent } from '@core/component';
import { getPatch } from 'fast-array-diff';
import { filter, switchMap, take } from 'rxjs';
import { onBeforeDestroy, onRendered } from '@core/scope';
import { Comment } from '../comment';
import { ArrayItem } from './array-item';
import { EachComponent, KeyFactory } from './@types';

export type ForEachState<T> = {
  array: ArrayItem<T>[];
  anchorStart?: JSX.Element;
  each?: EachComponent<T>;
};

export function useFor<T>(
  array: ValueOrObservableOrGetter<T[]>,
  keyFactory: KeyFactory<T>,
) {
  return defineComponent<{
    each: EachComponent<T>;
  }>(({ each }) => {
    const anchorStart = <Comment text="foreach-anchor"></Comment>;
    let ComponentsArray: ArrayItem<T>[] = [];
    const isRendering$ = ref(false);

    const setArray = (value: T[]) => {
      isRendering$.value = true;
      const newArray = value.map(
        (item, index) => new ArrayItem(item, keyFactory(item, index), index),
      );

      if (ComponentsArray.length === 0) {
        let anchor = anchorStart;
        newArray.forEach((item) => {
          const currentAnchor = anchor;
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          anchor = item.render(each!).after(currentAnchor);
        });
        ComponentsArray = newArray;
      } else if (ComponentsArray.length === newArray.length) {
        for (let i = 0; i < ComponentsArray.length; i += 1) {
          const oldItem = ComponentsArray[i];
          const newItem = newArray[i];
          if (oldItem.key !== newItem.key) {
            oldItem.key = newItem.key;
            oldItem.itemRef.value = newItem.itemRef.value;
          }
        }
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
                  : ComponentsArray.find((_, n) => n === p.newPos - 1)
                      ?.endAnchor;
              if (anchor == null) {
                throw new Error('Cannot find anchor to patch');
              }
              p.items.forEach((item) => {
                if (anchor == null) {
                  throw new Error('Cannot find anchor to patch');
                }
                const currentAnchor = anchor;
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
      isRendering$.value = false;
    };

    onRendered()
      .pipe(switchMap(() => toObservable(array)))
      .subscribe((a) => {
        if (isRendering$.value) {
          isRendering$
            .pipe(
              filter((v) => !v),
              take(1),
            )
            .subscribe(() => setArray(a));
        } else {
          setArray(a);
        }
      });

    onBeforeDestroy().subscribe(() => {
      ComponentsArray.forEach((item) => {
        item.remove();
      });
    });

    return <>{anchorStart}</>;
  });
}
