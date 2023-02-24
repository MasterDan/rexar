import 'reflect-metadata';
import { createApp } from '@rexar/core';
import { lorem } from './components/lorem/lorem.component';

createApp(lorem.create()).mount('#app');
