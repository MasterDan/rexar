/* eslint-disable class-methods-use-this */
import { el } from '@core/components/builtIn/html-element.component';
import { text } from '@core/components/builtIn/text.component';
import { ref$ } from '@core/reactivity/ref';
import { Observable } from 'rxjs';
import { IBinding } from '../@types/binding-target';
import { HtmlRendererBase } from './html-renderer-base';

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
});

