import {
  defineComponent,
  EventEmitter,
  pickElement,
  ref$,
  triggerEvent,
} from '@rexar/core';
import template from 'bundle-text:./task.component.html';
import { Task } from '../../models/task';

export const task = defineComponent<{ task?: Task; onDelete?: EventEmitter }>({
  template: () => template,
  props: () => ({}),
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
  },
});
