import {
  defineComponent,
  EventEmitter,
  into,
  MayBeReadonlyRef,
  pickElement,
  ref$,
  triggerEvent,
} from '@rexar/core';
import { Task } from '../../models/task';

export const task = defineComponent<{
  task: MayBeReadonlyRef<Task | undefined>;
  onDelete?: EventEmitter;
}>({
  id: 'Task',
  template: (c) => c.fromModule(() => import('./task.component.html')),
  props: () => ({ task: ref$() }),
  setup: ({ props }) => {
    pickElement('title').bindContent.text(ref$(() => props.task?.value?.title));
    pickElement('description').bindContent.text(
      ref$(() => props.task?.value?.description),
    );
    pickElement('delete-btn')
      .on('click')
      .subscribe(() => {
        triggerEvent(props.onDelete, null);
      });
    into('description-container').if(
      ref$(() => {
        const description = props.task?.value?.description ?? '';
        return description.trim() !== '';
      }),
      (c) => {
        c.whenTrue.displaySelf();
      },
    );
  },
});
