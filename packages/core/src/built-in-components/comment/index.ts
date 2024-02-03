import { defineComponent } from '@core/component';
import { MaybeObservable } from '@rexar/reactivity';
import { isObservable } from 'rxjs';

export const Comment = defineComponent<{ text: MaybeObservable<string> }>(
  ({ text }) => {
    const value = isObservable(text) ? '' : text;
    const commentNode = document.createComment(value);
    if (isObservable(text)) {
      text.subscribe((t) => {
        commentNode.textContent = t;
      });
    }
    return commentNode as unknown as JSX.Element;
  },
);
