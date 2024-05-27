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
import { filter, of, switchMap, tap } from 'rxjs';
import { Comment } from '../comment';

export function useDynamic(initial: RenderFunction | null = null) {
  /** @todo change constructor and maybe default val */
  const componentRef = new Ref<ComponentRenderFunc | null>(null);

  const setComponent = (fn: RenderFunction | null) => {
    console.log('changed to', fn);
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
        switchMap((p) => (p ? of('wait') : componentRef)),
        filter((i): i is Exclude<typeof i, string> => i !== 'wait'),
      )
      .subscribe((DynamicBody) => {
        if (previous) {
          removeInProcess.value = true;
          previous.remove().subscribe(() => {
            console.log('removed');
            previous = undefined;
            removeInProcess.value = false;
          });
          return;
        }
        if (DynamicBody) {
          console.log('dynamic rendering');
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
