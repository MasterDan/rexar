import { defineComponent } from '@core/component';
import { onRendered } from '@core/scope';
import { Ref } from '@rexar/reactivity';
import { ComponentChildren } from '@rexar/jsx';

export const Capture = defineComponent<{
  el$?: Ref<HTMLElement | undefined>;
}>(({ children, el$ }) => {
  if (el$) {
    const processChildren = (ch: ComponentChildren) => {
      if (Array.isArray(ch)) {
        if (ch.length !== 1) {
          throw new Error('Capture component must have only one child');
        }
        const [child] = ch;
        if (Array.isArray(child)) {
          processChildren(child);
        }
        if (child instanceof HTMLElement) {
          el$.value = child;
        }
      } else if (ch instanceof HTMLElement) {
        el$.value = ch;
      }
    };

    onRendered().subscribe(() => {
      processChildren(children);
    });
  }
  return <>{children}</>;
});

