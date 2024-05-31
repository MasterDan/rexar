import { BaseProps } from '@rexar/jsx';
import { RenderedController, defineComponent, render } from '@core/component';
import { ref } from '@rexar/reactivity';
import { onBeforeDestroy, useContext } from '@core/scope';
import { filter, of, switchMap } from 'rxjs';
import { Comment } from '../comment';
import { Waiter } from './waiter';

export type DynamicRenderFunc = (
  props: BaseProps & { waiter?: Waiter },
) => JSX.Element;

export function useDynamic(
  initial: DynamicRenderFunc | null = null,
  parentWaiter?: Waiter,
) {
  const componentRef = ref<DynamicRenderFunc | null>(null);

  const setComponent = (fn: DynamicRenderFunc | null) => {
    componentRef.value = fn ? defineComponent(fn) : null;
  };

  setComponent(initial);

  const component = defineComponent(({ children }) => {
    const waiter = new Waiter();
    // This needs for correct work of provide/inject mechanic in dynamic content
    const context = useContext();
    const comment = <Comment text="dynamic-anchor"></Comment>;
    const result = <>{comment}</>;
    let previous: RenderedController | undefined;

    if (parentWaiter) {
      parentWaiter.waitForMe((done) => {
        waiter.waitEveryone().then(done);
      });
    }

    const removeInProcess = ref(false);
    removeInProcess
      .pipe(
        switchMap((p) => (p ? of(false) : componentRef)),
        filter((i): i is Exclude<typeof i, boolean> => i !== false),
      )
      .subscribe((DynamicBody) => {
        if (previous) {
          removeInProcess.value = true;
          const prev = previous;
          waiter.waitEveryone().then(() => {
            prev.remove();
            previous = undefined;
            removeInProcess.value = false;
          });
          return;
        }
        if (DynamicBody) {
          previous = render(
            () => <DynamicBody waiter={waiter}>{children}</DynamicBody>,
            context,
          ).after(comment);
        }
      });
    onBeforeDestroy().subscribe(() => {
      if (previous) {
        previous.remove();
      }
    });
    return result;
  });

  return [component, setComponent] as const;
}
