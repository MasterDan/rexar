import { RenderFunction } from '@rexar/jsx';
import {
  ComponentRenderFunc,
  RenderedController,
  defineComponent,
  render,
} from '@core/component';
import { ref } from '@rexar/reactivity';
import { onBeforeDestroy, renderingScope } from '@core/scope';
import { RenderContext } from '@core/scope/context';
import { filter, of, switchMap } from 'rxjs';
import { Comment } from '../comment';

export function useDynamic(initial: RenderFunction | null = null) {
  const componentRef = ref<ComponentRenderFunc | null>(null);

  const setComponent = (fn: RenderFunction | null) => {
    componentRef.value = fn ? defineComponent(fn) : null;
  };

  setComponent(initial);

  const context =
    renderingScope.current?.value.context.createChildContext() ??
    new RenderContext();
  const component = defineComponent(({ children }) => {
    const comment = <Comment text="dynamic-anchor"></Comment>;
    const result = <>{comment}</>;
    let previous: RenderedController | undefined;
    const removeInProcess = ref(false);
    removeInProcess
      .pipe(
        switchMap((p) => (p ? of(false) : componentRef)),
        filter((i): i is Exclude<typeof i, boolean> => i !== false),
      )
      .subscribe((DynamicBody) => {
        if (previous) {
          removeInProcess.value = true;
          previous.remove().subscribe(() => {
            previous = undefined;
            removeInProcess.value = false;
          });
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
