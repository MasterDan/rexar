import { ref$ } from '@core/reactivity/ref';
import { isBrowser } from '@core/tools/env';
import { filter, firstValueFrom } from 'rxjs';
import { singleton } from 'tsyringe';

async function getDocument(): Promise<Document> {
  if (isBrowser()) {
    return window.document;
  }
  const { JSDOM } = await import('jsdom');
  return new JSDOM('<div id="app" ></div>').window.document;
}

@singleton()
export class DocumentRef {
  private document$ = ref$<Document>();

  get instance() {
    return firstValueFrom(
      this.document$.pipe(filter((d): d is Document => d != null)),
    );
  }

  constructor() {
    getDocument().then((val) => {
      this.document$.val = val;
    });
  }
}
