import { RenderFunction } from '@rexar/jsx';
import {
  ComponentRenderFunc,
  RenderedController,
  defineComponent,
  render,
} from '@core/component';
import { Ref } from '@rexar/reactivity';
import { onBeforeDestroy, renderingScope } from '@core/scope';
import { RenderContext } from '@core/scope/context';
import { type Subject } from 'rxjs';
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
    componentRef.subscribe((DynamicBody) => {
      let done$: Subject<void> | undefined;
      if (previous) {
        done$ = previous.remove();
      }
      if (DynamicBody) {
        const renderNew = () => {
          previous = render(
            () => <DynamicBody>{children}</DynamicBody>,
            context,
          ).after(comment);
        };
        if (done$) {
          done$.subscribe(() => {
            done$ = undefined;
            renderNew();
          });
        } else {
          renderNew();
        }
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
