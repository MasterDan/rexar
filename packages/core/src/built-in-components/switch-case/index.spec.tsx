import { h } from '@rexar/jsx';
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

    const [FlagSwitch, FlagCase, FlagDefault] = useSwitch<boolean>(flag);

    const root = (
      <div>
        <FlagSwitch>
          <FlagCase check={true}>
            <span>Value is true</span>
          </FlagCase>
          <FlagDefault>Value is false</FlagDefault>
        </FlagSwitch>
      </div>
    );

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

    const [NumberSwitch, NumberCase, NumDefault] = useSwitch<number>(number);

    const root = (
      <div>
        <NumberSwitch>
          <NumberCase check={1}>One</NumberCase>
          <NumberCase check={2}>Two</NumberCase>
          <NumDefault>Default</NumDefault>
        </NumberSwitch>
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
