import { defineComponent } from '@rexar/core';
import template from 'bundle-text:./todo-list.component.html';

export const todoList = defineComponent({
  template: () => template,
});
