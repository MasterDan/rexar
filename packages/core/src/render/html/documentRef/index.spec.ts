import { lastValueFrom } from 'rxjs';
import { container } from '@rexar/di';
import { describe, test, expect, beforeAll } from 'vitest';
import { documentRefToken } from '@core/components/module';
import { DocumentRef } from '.';

describe('document resolver', () => {
  beforeAll(() => {
    documentRefToken.provide(DocumentRef);
  });
  test('resolve document', async () => {
    const dRef = container.resolve<DocumentRef>('DocumentRef');
    const doc = await lastValueFrom(dRef.instance$);
    expect(doc.body.innerHTML).toBe('<div id="app"></div>');
    const el = doc.querySelector('#app');
    expect(el).not.toBeNull();
    expect(el?.outerHTML ?? 'oh no!').toBe('<div id="app"></div>');
  });
});
