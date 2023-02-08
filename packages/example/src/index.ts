import 'reflect-metadata';
import { createApp, text, ref$ } from '@rexar/core';

createApp(text({ value: ref$('I am rendered'), hasNextSibling: false })).mount(
  '#app',
);
