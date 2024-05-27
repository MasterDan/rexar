import { RenderFunction } from '@rexar/jsx';
import {
  ComponentRenderFunc,
  RenderedController,
  defineComponent,
  render,
} from '@core/component';
import { Ref, ref } from '@rexar/reactivity';
import { onBeforeDestroy, renderingScope } from '@core/scope';
import { RenderContext } from '@core/scope/context';
import { distinctUntilChanged, filter, switchMap, take, tap } from 'rxjs';
import { Comment } from '../comment';

export function useDynamic(initial: RenderFunction | null = null) {
  /** @todo change constructor and maybe default val */
  const componentRef = new Ref<ComponentRenderFunc | null>(null);

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
        tap((p) => console.log('dynamic-processing', p)),
        filter((p) => !p),
        switchMap(() => componentRef),
        distinctUntilChanged(),
      )
      .subscribe((DynamicBody) => {
        if (previous) {
          removeInProcess.value = true;
          previous.remove().subscribe(() => {
            removeInProcess.value = false;
          });
        }
        if (DynamicBody) {
          removeInProcess
            .pipe(
              filter((p) => !p),
              take(1),
            )
            .subscribe(() => {
              console.log('dynamic rendering');
              previous = render(
                () => <DynamicBody>{children}</DynamicBody>,
                context,
              ).after(comment);
            });
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
