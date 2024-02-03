import { describe, expect, test } from 'vitest';
import { ref } from '@rexar/reactivity';
import { h, fragment } from './create-element';
import { BaseProps } from './@types';

/**
 * @vitest-environment jsdom
 */
describe('create-element', () => {
  test('simple element', () => {
    const root = <div data-foo="bar"></div>;
    expect(root).toEqual(<div data-foo="bar"></div>);
  });
  test('simple component', () => {
    const CustomSpan = ({ text }: { text: string }) => (
      <span>Text is {text}</span>
    );
    const root = (
      <div>
        <CustomSpan text="foo"></CustomSpan>
      </div>
    );
    expect(root.outerHTML).toBe(
      (
        <div>
          <span>Text is foo</span>
        </div>
      ).outerHTML,
    );
  });
  test('component with children', () => {
    type CustomDivProps = { cls: string } & BaseProps;
    const CustomDiv = ({ cls, children }: CustomDivProps) => (
      <div class={cls}>{children}</div>
    );
    const root = (
      <CustomDiv cls="bg-blue">
        <div>foo</div>
        <div>bar</div>
      </CustomDiv>
    );
    expect(root.outerHTML).toBe(
      (
        <div class="bg-blue">
          <div>foo</div>
          <div>bar</div>
        </div>
      ).outerHTML,
    );
  });
  test('component with reactive property', () => {
    const counter = ref(1);
    const increment = () => {
      counter.value += 1;
    };
    type TestComponentProps = { counter: typeof counter };
    const TestComponent = ({ counter: cnt }: TestComponentProps) => (
      <div data-counter={cnt}>
        <span>Counter is {cnt}</span>
        <input type="number" value={cnt}></input>
      </div>
    );
    const root = <TestComponent counter={counter}></TestComponent>;
    expect(counter.value).toBe(1);
    expect(root.outerHTML).toBe(
      (
        <div data-counter="1">
          <span>Counter is 1</span>
          <input type="number" value="1"></input>
        </div>
      ).outerHTML,
    );
    increment();
    expect(counter.value).toBe(2);
    expect(root.outerHTML).toBe(
      (
        <div data-counter="2">
          <span>Counter is 2</span>
          <input type="number" value="2"></input>
        </div>
      ).outerHTML,
    );
    increment();
    expect(counter.value).toBe(3);
    expect(root.outerHTML).toBe(
      (
        <div data-counter="3">
          <span>Counter is 3</span>
          <input type="number" value="3"></input>
        </div>
      ).outerHTML,
    );
  });
  test('fragment', () => {
    const TestFragment = () => (
      <>
        <div>foo</div>
        <div>bar</div>
      </>
    );
    const divToMatch = (
      <div>
        <div>foo</div>
        <div>bar</div>
      </div>
    );
    const divToTest = (
      <div>
        <TestFragment></TestFragment>
      </div>
    );
    expect(divToTest.innerHTML).toBe(divToMatch.innerHTML);
  });
});
