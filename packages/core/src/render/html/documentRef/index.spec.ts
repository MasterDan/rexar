import { container } from '@rexar/di';
import { describe, test, expect, beforeAll } from 'vitest';
import { documentRefToken } from '@core/components/module';
import { IDocumentRef } from './@types/IDocumentRef';
import { DocumentRefDev } from './document-ref.dev';

describe('document resolver', () => {
  beforeAll(() => {
    documentRefToken.provide(DocumentRefDev);
  });
  test('resolve document', () => {
    const dRef = container.resolve<IDocumentRef>('IDocumentRef');
    const doc = dRef.document;
    expect(doc.body.innerHTML).toBe('<div id="app"></div>');
    const el = doc.querySelector('#app');
    expect(el).not.toBeNull();
    expect(el?.outerHTML ?? 'oh no!').toBe('<div id="app"></div>');
  });
});
