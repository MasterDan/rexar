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

    const [FlagSwitch, FlagCase, FlagDefault] = useSwitch<boolean>();

    const root = (
      <div>
        <FlagSwitch value={flag}>
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
          <Comment text="dynamic-anchor"></Comment>
        </div>
      ).outerHTML,
    );
    toggle();
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor"></Comment>
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

    const [NumberSwitch, NumberCase, NumDefault] = useSwitch<number>();

    const root = (
      <div>
        <NumberSwitch value={number}>
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
          <Comment text="dynamic-anchor"></Comment>
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
          <Comment text="dynamic-anchor"></Comment>
          <Comment text="dynamic-anchor"></Comment>
        </div>
      ).outerHTML,
    );

    inc();
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor"></Comment>
          <Comment text="dynamic-anchor"></Comment>
          Two
          <Comment text="dynamic-anchor"></Comment>
        </div>
      ).outerHTML,
    );

    inc();
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor"></Comment>
          <Comment text="dynamic-anchor"></Comment>
          <Comment text="dynamic-anchor"></Comment>
          Default
        </div>
      ).outerHTML,
    );
  });
});
