import { h, fragment } from '@rexar/jsx';
import { describe, expect, test } from 'vitest';
import { ref } from '@rexar/reactivity';
import { useSwitch } from '.';
import { Comment } from '../comment';

/**
 * @vitest-environment jsdom
 */
describe('switch-case rendering ', () => {
  test('boolean switch', () => {
    const flag = ref(true);
    const toggle = () => {
      flag.value = !flag.value;
    };

    const FlagSwitch = useSwitch(flag);

    const root = (
      <div>
        <FlagSwitch
          setup={(setCase) => {
            setCase(true, () => <span>Value is true</span>);
          }}
          default={() => <>Value is false</>}
        ></FlagSwitch>
      </div>
    );
    document.body.appendChild(root);

    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor"></Comment>
          <span>Value is true</span>
        </div>
      ).outerHTML,
    );
    toggle();
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor"></Comment>
          Value is false
        </div>
      ).outerHTML,
    );
  });
  test('numeric switch', () => {
    const number = ref(0);
    const inc = () => {
      number.value += 1;
    };

    const NumberSwitch = useSwitch(number);

    const root = (
      <div>
        <NumberSwitch
          setup={(setCase) => {
            setCase(1, () => <>One</>);
            setCase(
              (i) => i === 2,
              () => <>Two</>,
            );
          }}
          default={() => <>Default</>}
        ></NumberSwitch>
      </div>
    );

    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor"></Comment>
          Default
        </div>
      ).outerHTML,
    );

    inc();
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor"></Comment>
          One
        </div>
      ).outerHTML,
    );

    inc();
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor"></Comment>
          Two
        </div>
      ).outerHTML,
    );

    inc();
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor"></Comment>
          Default
        </div>
      ).outerHTML,
    );
  });
});
