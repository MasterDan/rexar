import { RenderFunction } from '@rexar/jsx';
import {
  ComponentRenderFunc,
  RenderedController,
  defineComponent,
  render,
} from '@core/component';
import { Ref } from '@rexar/reactivity';
import { onBeforeDestroy } from '@core/scope';
import { Comment } from '../comment';

export function useDynamic(initial: RenderFunction | null = null) {
  const componentRef = new Ref<ComponentRenderFunc | null>(null);

  const setComponent = (fn: RenderFunction | null) => {
    componentRef.value = fn ? defineComponent(fn) : null;
  };

  setComponent(initial);

  const component = defineComponent(({ children }) => {
    const comment = <Comment text="dynamic-anchor"></Comment>;
    const result = <>{comment}</>;
    let previous: RenderedController | undefined;
    componentRef.subscribe((DynamicBody) => {
      if (previous) {
        previous.remove();
      }
      if (DynamicBody) {
        previous = render(() => <DynamicBody>{children}</DynamicBody>).after(
          comment,
        );
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
