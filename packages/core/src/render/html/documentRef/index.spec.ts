import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { container } from 'tsyringe';
import { DocumentRef } from '.';

describe('document resolver', () => {
  test('resolve document', async () => {
    const dRef = container.resolve(DocumentRef);
    const doc = await lastValueFrom(dRef.instance$);
    expect(doc.body.innerHTML).toBe('<div id="app"></div>');
    const el = doc.querySelector('#app');
    expect(el).not.toBeNull();
    expect(el?.outerHTML ?? 'oh no!').toBe('<div id="app"></div>');
  });
});
