import { render } from '@core/component';
import { describe, expect, test } from 'vitest';
import { wait } from '@rexar/tools';
import { TestProvider } from './TestProvider';
import { TestInjector } from './TestInjector';

/**
 * @vitest-environment jsdom
 */
describe('provide-inject', () => {
  test('simple-provide', async () => {
    const root = <div></div>;
    document.body.appendChild(root);
    render(() => <TestProvider content={() => <TestInjector />} />).into(root);
    expect(root.outerHTML).toBe(
      (
        <div>
          <div>
            <span>Hello World</span>
            <span>Reactive Message</span>
          </div>
        </div>
      ).outerHTML,
    );
    await wait(600);
    expect(root.outerHTML).toBe(
      (
        <div>
          <div>
            <span>Hello World</span>
            <span>Message Changed</span>
          </div>
        </div>
      ).outerHTML,
    );
  });
  test('override-injections', async () => {
    const root = <div></div>;
    document.body.appendChild(root);
    render(() => (
      <TestProvider
        content={() => (
          <>
            <TestInjector />
            <TestProvider
              message="Overridden"
              content={() => <TestInjector />}
            />
          </>
        )}
      />
    )).into(root);
    expect(root.outerHTML).toBe(
      (
        <div>
          <div>
            <span>Hello World</span>
            <span>Reactive Message</span>
          </div>
          <div>
            <span>Overridden</span>
            <span>Reactive Message</span>
          </div>
        </div>
      ).outerHTML,
    );
    await wait(600);
    expect(root.outerHTML).toBe(
      (
        <div>
          <div>
            <span>Hello World</span>
            <span>Message Changed</span>
          </div>
          <div>
            <span>Overridden</span>
            <span>Message Changed</span>
          </div>
        </div>
      ).outerHTML,
    );
  });
});

