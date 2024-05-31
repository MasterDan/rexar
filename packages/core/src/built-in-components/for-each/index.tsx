import { Source, ref, toObservable } from '@rexar/reactivity';
import { defineComponent } from '@core/component';
import { getPatch } from 'fast-array-diff';
import { filter, switchMap, take } from 'rxjs';
import { onBeforeDestroy, onRendered, useContext } from '@core/scope';
import { Comment } from '../comment';
import { ArrayItem } from './array-item';
import { EachComponent, KeyFactory } from './@types';
import { Waiter } from '../dynamic/waiter';

export type ForEachState<T> = {
  array: ArrayItem<T>[];
  anchorStart?: JSX.Element;
  each?: EachComponent<T>;
};

export function useFor<T>(array: Source<T[]>, keyFactory: KeyFactory<T>) {
  return defineComponent<{
    each: EachComponent<T>;
  }>(({ each }) => {
    const anchorStart = <Comment text="foreach-anchor"></Comment>;
    let arrayItems: ArrayItem<T>[] = [];
    const isRendering$ = ref(false);
    const context = useContext();
    const waiter = new Waiter();

    const setArray = (value: T[]) => {
      isRendering$.value = true;
      const newArray = value.map(
        (item, index) =>
          new ArrayItem(item, keyFactory(item, index), index, context, waiter),
      );

      if (arrayItems.length === 0) {
        let anchor = anchorStart;
        newArray.forEach((item) => {
          const currentAnchor = anchor;
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          anchor = item.render(each!).after(currentAnchor);
        });
        arrayItems = newArray;
      } else if (arrayItems.length === newArray.length) {
        for (let i = 0; i < arrayItems.length; i += 1) {
          const oldItem = arrayItems[i];
          const newItem = newArray[i];
          if (oldItem.key !== newItem.key) {
            oldItem.key = newItem.key;
            oldItem.itemRef.value = newItem.itemRef.value;
          }
        }
      } else {
        const patch = getPatch(arrayItems, newArray, (a, b) => a.key === b.key);
        // eslint-disable-next-line no-restricted-syntax
        for (const p of patch) {
          if (p.type === 'remove') {
            // eslint-disable-next-line no-restricted-syntax
            for (const item of p.items) {
              arrayItems.splice(item.indexRef.value, 1);
              arrayItems.forEach((i, index) => {
                i.indexRef.value = index;
              });
              item.remove();
            }
          } else {
            let anchor =
              p.newPos === 0
                ? anchorStart
                : arrayItems.find((_, n) => n === p.newPos - 1)?.endAnchor;
            if (anchor == null) {
              throw new Error('Cannot find anchor to patch');
            }
            // eslint-disable-next-line no-restricted-syntax
            for (const item of p.items) {
              if (anchor == null) {
                throw new Error('Cannot find anchor to patch');
              }
              const currentAnchor = anchor;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              anchor = item.render(each!).after(currentAnchor);
              arrayItems.splice(item.indexRef.value, 0, item);
              arrayItems.forEach((i, index) => {
                i.indexRef.value = index;
              });
            }
          }
        }
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
      arrayItems.forEach((item) => {
        item.remove();
      });
    });

    return <>{anchorStart}</>;
  });
}
