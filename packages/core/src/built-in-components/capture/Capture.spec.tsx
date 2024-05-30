import { render } from '@core/component';
import { ref } from '@rexar/reactivity';
import { describe, expect, test } from 'vitest';

import { Capture } from './Capture';

/**
 * @vitest-environment jsdom
 */
describe('capture-content', () => {
  test('simple-div', () => {
    const root = <div></div>;
    document.body.appendChild(root);
    const el$ = ref<HTMLElement>();
    render(() => (
      <Capture el$={el$}>
        <div>Hello</div>
      </Capture>
    )).into(root);
    expect(el$.value?.outerHTML).toBe('<div>Hello</div>');
  });
});

