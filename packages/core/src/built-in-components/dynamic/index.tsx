import { RenderFunction } from '@rexar/jsx';
import {
  ComponentRenderFunc,
  RenderedController,
  defineComponent,
  render,
} from '@core/component';
import { ref } from '@rexar/reactivity';
import { onBeforeDestroy, useContext } from '@core/scope';
import { Subject, filter, of, switchMap, take } from 'rxjs';
import { Comment } from '../comment';
import { WaitContext, waitingProvider } from './waiting';

export function useDynamic(initial: RenderFunction | null = null) {
  const componentRef = ref<ComponentRenderFunc | null>(null);

  const setComponent = (fn: RenderFunction | null) => {
    componentRef.value = fn ? defineComponent(fn) : null;
  };

  setComponent(initial);

  const component = defineComponent(({ children }) => {
    // This needs for correct work of provide/inject mechanic in dynamic content
    const context = useContext();
    const comment = <Comment text="dynamic-anchor"></Comment>;
    const result = <>{comment}</>;
    let previous: RenderedController | undefined;
    const waitContext: WaitContext = {
      done$: new Subject<void>(),
      waitForMe$: ref(false),
      imWaiting$: new Subject<void>(),
    };
    waitingProvider.provide(waitContext);
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
          const finalize = () => {
            prev.remove();
            previous = undefined;
            removeInProcess.value = false;
          };
          if (waitContext.waitForMe$.value) {
            waitContext.done$.pipe(take(1)).subscribe(finalize);
            waitContext.imWaiting$.next();
          } else {
            finalize();
          }
          return;
        }
        if (DynamicBody) {
          previous = render(
            () => <DynamicBody>{children}</DynamicBody>,
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
