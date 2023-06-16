import {
  createEvent,
  defineComponent,
  into,
  pickElement,
  pickTemplate,
  ref$,
} from '@rexar/core';
import template from 'bundle-text:./todo-list.component.html';
import { Task } from '../../models/task';
import { task } from './task.component';

export const todoList = defineComponent({
  template: () => template,
  setup: () => {
    const list = ref$<Task[]>([]);

    pickTemplate('todo-item')
      .forEach(list, () => Symbol('item'))
      .defineComponent({
        setup: ({ props }) => {
          const onDelete = createEvent();
          onDelete.listener$.subscribe(() => {
            const index = props.item.value?.index;
            if (index != null) {
              list.patch((arr) => arr.filter((_, i) => i !== index));
            }
          });
          into('value').mountComponent(task, {
            task: ref$(() => props.item.value?.value),
            onDelete: onDelete.emitter,
          });
        },
      })
      .mount('todo-items');

    const taskToAdd = ref$<Task>();
    const taskToAddTitle = ref$(
      () => taskToAdd.value?.title,
      (t) => {
        if (t && taskToAdd.value) {
          taskToAdd.patch((x) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            x!.title = t;
          });
        }
      },
    );
    const taskToAddDescription = ref$(
      () => taskToAdd.value?.description,
      (d) => {
        if (d && taskToAdd.value) {
          taskToAdd.patch((x) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            x!.description = d;
          });
        }
      },
    );
    pickElement('title').bindValue.string(taskToAddTitle);
    pickElement('description').bindValue.string(taskToAddDescription);

    const dialog = pickElement('add-item-dialog').nativeElement;
    pickElement('add-item')
      .on('click')
      .subscribe(() => {
        if (dialog.value == null) {
          return;
        }
        taskToAdd.value = new Task('', '');
        (dialog.value as HTMLDialogElement).showModal();
      });
    pickElement('save')
      .on('click')
      .subscribe(() => {
        if (dialog.value == null) {
          return;
        }
        list.patch((l) => {
          if (taskToAdd.value) {
            l.push(taskToAdd.value);
          }
        });
        taskToAdd.value = undefined;
        (dialog.value as HTMLDialogElement).close();
      });
  },
});
