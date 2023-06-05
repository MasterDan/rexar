import { WritableReadonlyRef } from '@core/reactivity/ref/readonly.ref.writable';
import { Ref } from '@core/reactivity/ref/ref';
import { Observable } from 'rxjs';
import { ComponentLifecycle } from '../base/lifecycle';
import { AnyComponent } from './any-component';
import { IBinding } from './binding-target';

export interface IHtmlRenderer {
  target$: Ref<IBinding | undefined>;
  nextTarget$: Ref<IBinding | undefined>;
  lifecycle$: WritableReadonlyRef<ComponentLifecycle>;
  subscribeParentLifecycle(life: Observable<ComponentLifecycle>): void;
  setComponent(c: AnyComponent): void;
  render(): Promise<void>;
  unmount(): Promise<void>;
  component: AnyComponent;
}

