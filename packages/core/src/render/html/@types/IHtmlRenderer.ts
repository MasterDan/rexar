import { Ref } from '@core/reactivity/ref/ref';
import { AnyComponent } from './any-component';
import { IBinding } from './binding-target';

export interface IHtmlRenderer {
  target$: Ref<IBinding | undefined>;
  nextTarget$: Ref<IBinding | undefined>;
  setComponent(c: AnyComponent): void;
  render(): Promise<void>;
  unmount(): Promise<void>;
}
