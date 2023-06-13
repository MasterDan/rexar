/* eslint-disable class-methods-use-this */
import { el } from '@core/components/builtIn/element.component';
import { text } from '@core/components/builtIn/text.component';
import { ref$ } from '@core/reactivity/ref';
import { Observable } from 'rxjs';
import { IBinding } from '../@types/binding-target';
import { HtmlRendererBase } from './html-renderer-base';
import { ComponentLifecycle } from './lifecycle';

class TestRenderer extends HtmlRendererBase {
  public get comp$() {
    return ref$(this.component$);
  }

  renderInto(_: IBinding): Observable<IBinding | undefined> {
    throw new Error('Method not implemented.');
  }

  unmount(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

describe('test renderer', () => {
  test('simple', () => {
    const testComponent = el({ name: 'div' });
    const testComponentSecond = text({ value: ref$('foo') });
    const one = new TestRenderer();
    const two = new TestRenderer();
    expect(one.comp$.value).toBeUndefined();
    expect(two.comp$.value).toBeUndefined();
    one.setComponent(testComponent);
    expect(one.comp$.value).toEqual(testComponent);
    expect(two.comp$.value).toBeUndefined();
    two.setComponent(testComponentSecond);
    expect(one.comp$.value).toEqual(testComponent);
    expect(two.comp$.value).toEqual(testComponentSecond);
  });
  test('lifecycle values', () => {
    const parentLife$ = ref$(ComponentLifecycle.Created);
    const renderer = new TestRenderer();
    renderer.subscribeParentLifecycle(parentLife$);

    expect(renderer.lifecycle$.value).toBe(ComponentLifecycle.Created);

    renderer.lifecycle$.value = ComponentLifecycle.BeforeRender;
    expect(renderer.lifecycle$.value).toBe(ComponentLifecycle.Created);

    parentLife$.value = ComponentLifecycle.BeforeRender;
    expect(renderer.lifecycle$.value).toBe(ComponentLifecycle.BeforeRender);

    renderer.lifecycle$.value = ComponentLifecycle.Rendered;
    expect(renderer.lifecycle$.value).toBe(ComponentLifecycle.BeforeRender);

    parentLife$.value = ComponentLifecycle.Rendered;
    expect(renderer.lifecycle$.value).toBe(ComponentLifecycle.Rendered);

    parentLife$.value = ComponentLifecycle.Mounted;
    expect(renderer.lifecycle$.value).toBe(ComponentLifecycle.Mounted);

    renderer.lifecycle$.value = ComponentLifecycle.Rendered;
    expect(renderer.lifecycle$.value).toBe(ComponentLifecycle.Mounted);

    parentLife$.value = ComponentLifecycle.BeforeUnmount;
    expect(renderer.lifecycle$.value).toBe(ComponentLifecycle.BeforeUnmount);

    parentLife$.value = ComponentLifecycle.Unmounted;
    expect(renderer.lifecycle$.value).toBe(ComponentLifecycle.Unmounted);

    parentLife$.value = ComponentLifecycle.Mounted;
    renderer.lifecycle$.value = ComponentLifecycle.Rendered;
    expect(renderer.lifecycle$.value).toBe(ComponentLifecycle.Mounted);

    renderer.lifecycle$.value = ComponentLifecycle.BeforeUnmount;
    expect(renderer.lifecycle$.value).toBe(ComponentLifecycle.BeforeUnmount);

    renderer.lifecycle$.value = ComponentLifecycle.Unmounted;
    expect(renderer.lifecycle$.value).toBe(ComponentLifecycle.Unmounted);
  });
});

