import { describe, expect, test } from 'vitest';
import { h, fragment } from '@rexar/jsx';
import { onBeforeDestroy, onDestroyed, onMounted } from '@core/scope';
import { ref } from '@rexar/reactivity';
import { wait } from '@rexar/tools';
import { Subject, map } from 'rxjs';
import { useFor } from '@core/built-in-components/for-each';
import { Comment } from '@core/built-in-components/comment';
import { defineComponent, render } from '.';

/**
 * @vitest-environment jsdom
 */
describe('components', () => {
  test('simple component', () => {
    const Text = defineComponent<{ value: string }>(({ value }) => (
      <span>Text is {value}</span>
    ));
    const root = (
      <div>
        <Text value="some text"></Text>
      </div>
    );
    expect(root.outerHTML).toBe(
      (
        <div>
          <span>Text is some text</span>
        </div>
      ).outerHTML,
    );
  });
  test('onMounted hook', async () => {
    const InnerComponent = defineComponent(() => {
      const number = new Subject<number>();
      let numb = 0;
      onMounted().subscribe(() => {
        numb += 1;
        number.next(numb);
      });
      return <span>{number}</span>;
    });
    const Component = defineComponent(() => {
      const value = ref(0);
      const inc = () => {
        value.value += 1;
      };
      onMounted().subscribe(() => {
        inc();
      });
      return (
        <div>
          <span>Value is {value}</span>
          <InnerComponent></InnerComponent>
        </div>
      );
    });
    const root = <div></div>;
    render(Component).into(root);
    expect(root.innerHTML).toBe(
      (
        <div>
          <span>Value is 0</span>
          <span></span>
        </div>
      ).outerHTML,
    );
    await wait(200);
    expect(root.innerHTML).toBe(
      (
        <div>
          <span>Value is 1</span>
          <span>1</span>
        </div>
      ).outerHTML,
    );
    await wait(100);
    expect(root.innerHTML).toBe(
      (
        <div>
          <span>Value is 1</span>
          <span>1</span>
        </div>
      ).outerHTML,
    );
  });
  test('render after', () => {
    const Component = defineComponent<{ text: string }>(({ text }) => (
      <span>{text}</span>
    ));
    const target = <div></div>;
    const root = <div>{target}</div>;
    const renderedComp = render(Component, { text: 'Some text' }).after(target);
    const renderedCompSecond = render(Component, {
      text: 'Some other text',
    }).after(target);

    expect(root.outerHTML).toBe(
      (
        <div>
          <div></div>
          <span>Some other text</span>
          <span>Some text</span>
        </div>
      ).outerHTML,
    );
    renderedComp.remove();
    expect(root.outerHTML).toBe(
      (
        <div>
          <div></div>
          <span>Some other text</span>
        </div>
      ).outerHTML,
    );
    renderedCompSecond.remove();
    expect(root.outerHTML).toBe(
      (
        <div>
          <div></div>
        </div>
      ).outerHTML,
    );
  });
  test('render fragment after', () => {
    const Component = defineComponent<{ text: string; header: string }>(
      ({ text, header }) => (
        <>
          <h2>{header}</h2>
          <span>{text}</span>
        </>
      ),
    );
    const target = <div></div>;
    const root = <div>{target}</div>;
    const first = render(Component, {
      header: 'First',
      text: 'first text',
    }).after(target);
    const second = render(Component, {
      header: 'Second',
      text: 'second text',
    }).after(target);
    expect(root.outerHTML).toBe(
      (
        <div>
          <div></div>
          <h2>Second</h2>
          <span>second text</span>
          <h2>First</h2>
          <span>first text</span>
        </div>
      ).outerHTML,
    );
    first.remove();
    expect(root.outerHTML).toBe(
      (
        <div>
          <div></div>
          <h2>Second</h2>
          <span>second text</span>
        </div>
      ).outerHTML,
    );
    second.remove();
    expect(root.outerHTML).toBe(
      (
        <div>
          <div></div>
        </div>
      ).outerHTML,
    );
  });
  test('destroy hooks', async () => {
    const statuses = ref<Record<string, string>>({});
    const setStatus = ({ name, status }: { name: string; status: string }) => {
      const val = statuses.value;
      val[name] = status;
      statuses.value = val;
    };

    const Component = defineComponent<{ name: string }>(({ name }) => {
      onMounted().subscribe(() => {
        setStatus({ name, status: 'mounted' });
      });
      onBeforeDestroy().subscribe(() => {
        setStatus({ name, status: 'destroying' });
      });
      onDestroyed().subscribe(() => {
        setStatus({ name, status: 'destroyed' });
      });
      return <span>{name}</span>;
    });
    const StatusMonitor = defineComponent<{ name: string }>(({ name }) => {
      const currentStatus = statuses.pipe(map((s) => s[name] ?? 'undefined'));
      return (
        <span>
          {name} is {currentStatus}
        </span>
      );
    });

    const subRoot = <div></div>;
    const first = render(Component, { name: 'First' }).into(subRoot);
    const second = render(Component, { name: 'Second' }).into(subRoot);
    const RootComponent = defineComponent(() => (
      <>
        <div>
          <StatusMonitor name="First"></StatusMonitor>
          <StatusMonitor name="Second"></StatusMonitor>
        </div>
        {subRoot}
      </>
    ));

    const rootDiv = <div></div>;
    render(RootComponent).into(rootDiv);
    expect(rootDiv.outerHTML).toBe(
      (
        <div>
          <div>
            <span>First is undefined</span>
            <span>Second is undefined</span>
          </div>
          <div>
            <span>First</span>
            <span>Second</span>
          </div>
        </div>
      ).outerHTML,
    );
    await wait(200);
    expect(rootDiv.outerHTML).toBe(
      (
        <div>
          <div>
            <span>First is mounted</span>
            <span>Second is mounted</span>
          </div>
          <div>
            <span>First</span>
            <span>Second</span>
          </div>
        </div>
      ).outerHTML,
    );
    first.remove();
    expect(rootDiv.outerHTML).toBe(
      (
        <div>
          <div>
            <span>First is destroyed</span>
            <span>Second is mounted</span>
          </div>
          <div>
            <span>Second</span>
          </div>
        </div>
      ).outerHTML,
    );
    second.remove();
    expect(rootDiv.outerHTML).toBe(
      (
        <div>
          <div>
            <span>First is destroyed</span>
            <span>Second is destroyed</span>
          </div>
          <div></div>
        </div>
      ).outerHTML,
    );
  });
  test('lifecycle_for_children', async () => {
    const statuses = ref<string[]>([]);
    const StatusTest = defineComponent<{ name: string }>(
      ({ name, children }) => {
        const renderMessage = `Name: ${name} is rendering`;
        // console.log(renderMessage);
        statuses.value.push(renderMessage);
        onMounted().subscribe(() => {
          const mountedMessage = `Name: ${name} is mounted`;
          // console.log(mountedMessage);
          statuses.value = statuses.value.map((i) =>
            i === renderMessage ? mountedMessage : i,
          );
        });
        return (
          <>
            <span>{name}</span>
            <div>
              {Array.isArray(children) && children.length === 0
                ? 'No children'
                : children}
            </div>
          </>
        );
      },
    );
    const Statuses = useFor(statuses, (i) => i);
    const App = defineComponent(() => (
      <>
        <StatusTest name="First"></StatusTest>
        <StatusTest name="Second">
          <StatusTest name="Third"></StatusTest>
        </StatusTest>
        <Statuses each={({ item }) => <div>{item}</div>}></Statuses>
      </>
    ));
    const root = <div></div>;
    render(App).into(root);
    expect(root.outerHTML).toBe(
      (
        <div>
          <span>First</span>
          <div>No children</div>
          <span>Second</span>
          <div>
            <span>Third</span>
            <div>No children</div>
          </div>
          <Comment text="foreach-anchor"></Comment>
          <div>Name: First is rendering</div>
          <Comment text="end-of-element"></Comment>
          <div>Name: Third is rendering</div>
          <Comment text="end-of-element"></Comment>
          <div>Name: Second is rendering</div>
          <Comment text="end-of-element"></Comment>
        </div>
      ).outerHTML,
    );
    await wait(200);
    expect(root.outerHTML).toBe(
      (
        <div>
          <span>First</span>
          <div>No children</div>
          <span>Second</span>
          <div>
            <span>Third</span>
            <div>No children</div>
          </div>
          <Comment text="foreach-anchor"></Comment>
          <div>Name: First is mounted</div>
          <Comment text="end-of-element"></Comment>
          <div>Name: Third is mounted</div>
          <Comment text="end-of-element"></Comment>
          <div>Name: Second is mounted</div>
          <Comment text="end-of-element"></Comment>
        </div>
      ).outerHTML,
    );
  });
});
