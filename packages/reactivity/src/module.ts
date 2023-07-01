import { DiContainer, lazy, singleton, useClass } from '@rexar/di';
import type { IComputedBuilder } from './computed/@types/IComputedBuilder';
import type { BindingContext } from './computed/binding-context';
import type { IRefBuilder } from './ref/@types/IRefBuilder';

const refContainer = new DiContainer();

export const bindingContextToken = refContainer.createToken(
  'binding-context',
  useClass<BindingContext>(),
  singleton(),
);

export const refBuilderToken = refContainer.createToken(
  'IRefBuilder',
  useClass<IRefBuilder>((c) => [c.resolve('IComputedBuilder')]),
  singleton(),
  lazy(),
);

export const computedBuilderToken = refContainer.createToken(
  'IComputedBuilder',
  useClass<IComputedBuilder>((c) => [
    c.resolve('binding-context'),
    c.resolve('IRefBuilder'),
  ]),
  singleton(),
  lazy(),
);
