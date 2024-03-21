import { describe, expect, test } from 'vitest';
import { h, fragment } from '@rexar/jsx';
import { ref } from '@rexar/reactivity';
import { Show, useIf } from '.';
import { Comment } from '../comment';

/**
 * @vitest-environment jsdom
 */
describe('if-else-rendering', () => {
  test('use-if-deprecated', async () => {
    const firstFlag = ref(true);
    const secondFlag = ref(false);
    const toggleFirst = () => {
      firstFlag.value = !firstFlag.value;
    };
    const toggleSecond = () => {
      secondFlag.value = !secondFlag.value;
    };

    const [[FirstFlagIsTrue, Else], elseIf] = useIf(firstFlag);
    const [[ElseIfTrue, OrElse]] = elseIf(secondFlag);

    const root = (
      <div>
        <FirstFlagIsTrue>
          <div>Value is True</div>
        </FirstFlagIsTrue>
        <Else>
          <div>Value is False</div>
        </Else>
        <ElseIfTrue>
          <div>Second Is True</div>
        </ElseIfTrue>
        <OrElse>
          <div>Second is False</div>
        </OrElse>
      </div>
    );
    document.body.appendChild(root);
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor"></Comment>
          <div>Value is True</div>
          <Comment text="dynamic-anchor"></Comment>
          <Comment text="dynamic-anchor"></Comment>
          <Comment text="dynamic-anchor"></Comment>
        </div>
      ).outerHTML,
    );
    toggleFirst();
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor"></Comment>
          <Comment text="dynamic-anchor"></Comment>
          <div>Value is False</div>
          <Comment text="dynamic-anchor"></Comment>
          <Comment text="dynamic-anchor"></Comment>
          <div>Second is False</div>
        </div>
      ).outerHTML,
    );
    toggleSecond();
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor"></Comment>
          <Comment text="dynamic-anchor"></Comment>
          <div>Value is False</div>
          <Comment text="dynamic-anchor"></Comment>
          <div>Second Is True</div>
          <Comment text="dynamic-anchor"></Comment>
        </div>
      ).outerHTML,
    );
    toggleFirst();
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor"></Comment>
          <div>Value is True</div>
          <Comment text="dynamic-anchor"></Comment>
          <Comment text="dynamic-anchor"></Comment>
          <Comment text="dynamic-anchor"></Comment>
        </div>
      ).outerHTML,
    );
  });
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
