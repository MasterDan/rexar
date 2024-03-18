import { h, fragment, RenderFunction } from '@rexar/jsx';
import { RenderedController, defineComponent, render } from '@core/component';
import { Ref } from '@rexar/reactivity';
import { onBeforeDestroy } from '@core/scope';
import { Comment } from '../comment';

export function useDynamic(initial: RenderFunction | null = null) {
  const componentRef = new Ref<RenderFunction | null>(initial);

  const component = defineComponent(({ children }) => {
    const comment = <Comment text="dynamic-anchor"></Comment>;
    const result = <>{comment}</>;
    let previous: RenderedController | undefined;
    componentRef.subscribe((rfVal) => {
      if (previous) {
        previous.remove();
      }
      if (rfVal) {
        previous = render(rfVal, { children }, { root: false }).after(comment);
      }
    });
    onBeforeDestroy().subscribe(() => {
      if (previous) {
        previous.remove();
      }
    });
    return result;
  });

  const update = (fn: RenderFunction | null) => {
    componentRef.value = fn;
  };

  return [component, update] as const;
}
