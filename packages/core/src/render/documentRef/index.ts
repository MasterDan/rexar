import { ref$ } from '@/reactivity/ref';
import { isBrowser } from '@/tools/env';
import { filter } from 'rxjs';
import { singleton } from 'tsyringe';

async function getDocument(): Promise<Document> {
  if (isBrowser()) {
    return window.document;
  }
  const { JSDOM } = await import('jsdom');
  return new JSDOM().window.document;
}

@singleton()
export class DocumentRef {
  private document$ = ref$<Document>();

  get instance() {
    return this.document$.pipe(filter((d): d is Document => d != null));
  }

  constructor() {
    getDocument().then((val) => {
      this.document$.val = val;
    });
  }
}
