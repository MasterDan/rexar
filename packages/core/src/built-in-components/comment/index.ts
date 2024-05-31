import { defineComponent } from '@core/component';
import { Source, ref } from '@rexar/reactivity';
import { skip } from 'rxjs';

export const Comment = defineComponent<{ text: Source<string> }>(({ text }) => {
  const text$ = ref('').withSource(text);
  const commentNode = document.createComment(text$.value);
  text$.pipe(skip(1)).subscribe((t) => {
    commentNode.textContent = t;
  });

  return commentNode as unknown as JSX.Element;
});
