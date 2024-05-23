import { defineComponent } from '@core/component';
import { onRendered } from '@core/scope';
import { Ref } from '@rexar/reactivity';

export const Capture = defineComponent<{
  el$?: Ref<HTMLElement | undefined>;
}>(({ children, el$ }) => {
  if (Array.isArray(children) && children.length > 1) {
    throw new Error('Capture component can only have one child');
  }
  if (el$) {
    onRendered().subscribe(() => {
      if (Array.isArray(children) && children.length === 1) {
        const [child] = children;
        if (child instanceof HTMLElement) {
          el$.value = child;
        }
      } else if (children instanceof HTMLElement) {
        el$.value = children;
      }
    });
  }
  return <>{children}</>;
});

