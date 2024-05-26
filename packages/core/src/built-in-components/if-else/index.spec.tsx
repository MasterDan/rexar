import { describe, expect, test } from 'vitest';
import { ref } from '@rexar/reactivity';
import { wait } from '@rexar/tools';
import { Show } from '.';
import { Comment } from '../comment';

/**
 * @vitest-environment jsdom
 */
describe('if-else-rendering', () => {
  test('show-component', async () => {
    const firstFlag = ref(true);
    const secondFlag = ref(false);
    const toggleFirst = () => {
      firstFlag.value = !firstFlag.value;
    };
    const toggleSecond = () => {
      secondFlag.value = !secondFlag.value;
    };

    const root = (
      <div>
        <Show
          when={firstFlag}
          content={() => <div>Value is True</div>}
          fallback={() => (
            <>
              <div>Value is False</div>
              <Show
                when={secondFlag}
                content={() => <div>Second Is True</div>}
                fallback={() => <div>Second is False</div>}
              />
            </>
          )}
        />
      </div>
    );
    document.body.appendChild(root);
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor"></Comment>
          <div>Value is True</div>
        </div>
      ).outerHTML,
    );
    toggleFirst();
    await wait(50);
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor"></Comment>
          <div>Value is False</div>
          <Comment text="dynamic-anchor"></Comment>
          <div>Second is False</div>
        </div>
      ).outerHTML,
    );
    toggleSecond();
    await wait(50);
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor"></Comment>
          <div>Value is False</div>
          <Comment text="dynamic-anchor"></Comment>
          <div>Second Is True</div>
        </div>
      ).outerHTML,
    );
    toggleFirst();
    await wait(50);
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor"></Comment>
          <div>Value is True</div>
        </div>
      ).outerHTML,
    );
  });
});
