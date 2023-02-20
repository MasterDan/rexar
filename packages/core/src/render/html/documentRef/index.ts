import { isBrowser } from '@core/tools/env';
import { filter, from, take } from 'rxjs';
import { singleton } from 'tsyringe';

@singleton()
export class DocumentRef {
  // eslint-disable-next-line class-methods-use-this
  async getDocument(): Promise<Document> {
    if (isBrowser()) {
      return window.document;
    }
    const { JSDOM } = await import('jsdom');
    return new JSDOM('<div id="app" ></div>').window.document;
  }

  private get document$() {
    return from(this.getDocument());
  }

  get instance$() {
    return this.document$.pipe(
      filter((d): d is Document => d != null),
      take(1),
    );
  }
}
