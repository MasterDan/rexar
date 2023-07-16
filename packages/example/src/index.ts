import 'reflect-metadata';
import { createApp } from '@rexar/core';
import { ScopedLogger } from '@rexar/logger';
import { root } from './components/root/root.component';

createApp(root).mount('body');

// @ts-expect-error no types
window.dump = () => {
  ScopedLogger.dump();
};
