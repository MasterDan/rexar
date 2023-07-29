import { createApp } from '@core/app';
import { createEvent } from '@core/components/events';
import { lastValueFrom, timer } from 'rxjs';
import { ref$ } from '@rexar/reactivity';
import { describe, test, expect, beforeAll } from 'vitest';
import { DocumentRefDev } from '@core/render/html/documentRef/document-ref.dev';
import { documentRefToken, nodeResolverToken } from '@core/components/module';
import { resolveNodes } from '@core/parsers/html/node-resolver/resolve-nodes.dev';
import { ClassBinding, CssProperties } from '@core/index';
import { ifElseRepeat } from './components/if-else.test/if-else-repeat.component';
import { ifElseSotsTest } from './components/if-else.test/if-else-slots-test.component';
import { ifElseTest } from './components/if-else.test/if-else-test.component';
import { inputTextTest } from './components/input-text-test/input-text-test.component';
import {
  LifecycleStatuses,
  repeatComponent,
} from './components/repeat/repeat.component';
import { slotTest } from './components/slot-test/slot-test.component';
import { testOne } from './components/test-one/test-one.component';
import { testThree } from './components/test-three/test-three.component';
import { testTwo } from './components/test-two/test-two.component';
import { classBindingTest } from './components/class-binding-test/class-binding-test.component';

describe('custom components', () => {
  beforeAll(() => {
    documentRefToken.provide(DocumentRefDev);
    nodeResolverToken.provide(resolveNodes);
  });
  test('test-one', async () => {
    const elApp = await createApp(testOne).mount('#app');
    expect(elApp?.outerHTML).toBe(
      '<div id="app">' +
        '<div>' +
        '<div>Lorem, ipsum dolor.</div>' +
        '<div>Necessitatibus, provident ut.</div>' +
        '<div>Minima, quae optio.</div>' +
        '</div>' +
        '</div>',
    );
  });
  test('test-two', async () => {
    const elApp = await createApp(testTwo).mount('#app');
    expect(elApp?.outerHTML).toBe(
      '<div id="app">' +
        '<div>' +
        '<div>Lorem, ipsum dolor.</div>' +
        '<div>middle text</div>' +
        '<div>Delectus, reiciendis illum.</div>' +
        '</div>' +
        '</div>',
    );
  });
  test('test-three', async () => {
    const appThree = await createApp(testThree).mount('#app');
    expect(appThree?.outerHTML).toBe(
      '<div id="app"><div>' +
        '<div>' +
        '<div>Lorem, ipsum dolor.</div>' +
        '<div>Sed, laboriosam numquam.</div>' +
        '<div>Qui, nobis repellat?</div>' +
        '<div>Nihil, eum eveniet.</div>' +
        '<div>Quidem, optio consectetur?</div>' +
        '</div>' +
        'one' +
        '<!--end of text-->' +
        '<div>' +
        '<input type="text">' +
        '<input type="text">' +
        '</div>' +
        'two' +
        '</div></div>',
    );
  });
  test('repeat-component', async () => {
    const array$ = ref$(['One', 'Two', 'Three']);
    const app = await createApp(repeatComponent, { array$ }).mount('#app');
    expect(app?.outerHTML).toBe(
      '<div id="app">' +
        '<h3>Repeat</h3>' +
        '<span>One</span>' +
        '<span>Two</span>' +
        '<span>Three</span>' +
        '</div>',
    );
    array$.patch((x) => {
      x.push('Four');
    });
    await lastValueFrom(timer(100));
    expect(app?.outerHTML).toBe(
      '<div id="app">' +
        '<h3>Repeat</h3>' +
        '<span>One</span>' +
        '<span>Two</span>' +
        '<span>Three</span>' +
        '<span>Four</span>' +
        '</div>',
    );
    array$.value = ['One', 'Two'];
    await lastValueFrom(timer(100));
    expect(app?.outerHTML).toBe(
      '<div id="app">' +
        '<h3>Repeat</h3>' +
        '<span>One</span>' +
        '<span>Two</span>' +
        '</div>',
    );
    array$.patch((v) => {
      v[0] = 'Hello, world';
    });
    await lastValueFrom(timer(100));
    expect(app?.outerHTML).toBe(
      '<div id="app">' +
        '<h3>Repeat</h3>' +
        '<span>Hello, world</span>' +
        '<span>Two</span>' +
        '</div>',
    );
  });
  test('slots', async () => {
    const root = await createApp(slotTest).mount('#app');
    expect(root?.outerHTML).toBe(
      '<div id="app">' +
        '<h2>Slot test</h2>' +
        '<span>Default content</span>' +
        'Some Content' +
        '</div>',
    );
  });
  test('if-else:simple', async () => {
    const toggler$ = ref$(false);
    const root = await createApp(ifElseTest, { toggler$ }).mount('#app');
    const content = {
      positive:
        '<div id="app">' +
        '<h2>If Else Test</h2>' +
        '<div>' +
        '<span>Simple html</span>' +
        '<div>And more</div>' +
        '</div>' +
        '<span>Slot content</span>' +
        '</div>',
      negative: '<div id="app"><h2>If Else Test</h2></div>',
    };

    expect(root?.outerHTML).toBe(content.negative);
    toggler$.value = true;
    await lastValueFrom(timer(100));
    expect(root?.outerHTML).toBe(content.positive);
    toggler$.value = false;
    await lastValueFrom(timer(100));
    expect(root?.outerHTML).toBe(content.negative);
    toggler$.value = true;
    await lastValueFrom(timer(200));
    expect(root?.outerHTML).toBe(content.positive);
    toggler$.value = false;
    await lastValueFrom(timer(100));
    expect(root?.outerHTML).toBe(content.negative);
  });
  test('if-else:slots:from-false', async () => {
    const toggler$ = ref$(false);
    const root = await createApp(ifElseSotsTest, { toggler$ }).mount('#app');
    const negativeContent = '<div id="app"><h2>If Else Slots Test</h2></div>';
    const positiveContent =
      '<div id="app">' +
      '<h2>If Else Slots Test</h2>' +
      '<span>Slot content</span>' +
      'Inner Content' +
      '</div>';
    expect(root?.outerHTML).toBe(negativeContent);
    toggler$.value = true;
    await lastValueFrom(timer(100));
    expect(root?.outerHTML).toBe(positiveContent);
    toggler$.value = false;
    await lastValueFrom(timer(100));
    expect(root?.outerHTML).toBe(negativeContent);
    toggler$.value = true;
    await lastValueFrom(timer(100));
    expect(root?.outerHTML).toBe(positiveContent);
    toggler$.value = false;
    await lastValueFrom(timer(100));
    expect(root?.outerHTML).toBe(negativeContent);
  });
  test('if-else:slots:from-true', async () => {
    const toggler$ = ref$(true);
    const root = await createApp(ifElseSotsTest, { toggler$ }).mount('#app');
    const negativeContent = '<div id="app"><h2>If Else Slots Test</h2></div>';
    const positiveContent =
      '<div id="app">' +
      '<h2>If Else Slots Test</h2>' +
      '<span>Slot content</span>' +
      'Inner Content' +
      '</div>';
    expect(root?.outerHTML).toBe(positiveContent);
    toggler$.value = false;
    await lastValueFrom(timer(100));
    expect(root?.outerHTML).toBe(negativeContent);
    toggler$.value = true;
    await lastValueFrom(timer(100));
    expect(root?.outerHTML).toBe(positiveContent);
    toggler$.value = false;
    await lastValueFrom(timer(100));
    expect(root?.outerHTML).toBe(negativeContent);
    toggler$.value = true;
    await lastValueFrom(timer(100));
    expect(root?.outerHTML).toBe(positiveContent);
  });
  test('if-else:repeat:from-false', async () => {
    const toggler$ = ref$(false);
    const array$ = ref$(['One', 'Two', 'Three']);
    const onLifecycleChange = createEvent<LifecycleStatuses>();
    const repeatLife$ = ref$(onLifecycleChange.listener$);

    const arrayHtml$ = ref$(() =>
      array$.value.map((i) => `<span>${i}</span>`).join(''),
    );
    const content$ = ref$(
      () =>
        `<div id="app">${
          toggler$.value ? `<h3>Repeat</h3>${arrayHtml$.value}` : ''
        }</div>`,
    );

    const root = await createApp(ifElseRepeat, {
      toggler$,
      array$,
      lifecycleChanged: onLifecycleChange.emitter,
    }).mount('#app');

    // let tryNumb = 0;
    const addRemoveTest = async () => {
      // tryNumb += 1;
      // console.log(`${tryNumb}-st check`);

      array$.patch((arr) => {
        arr.push('Four');
      });
      await lastValueFrom(timer(100));
      expect(root?.outerHTML).toBe(content$.value);
      array$.patch((arr) => {
        arr.pop();
      });
      await lastValueFrom(timer(100));
      expect(root?.outerHTML).toBe(content$.value);
    };

    expect(root?.outerHTML).toBe(content$.value);
    expect(repeatLife$.value).toBeUndefined();
    await addRemoveTest();

    toggler$.value = true;
    await lastValueFrom(timer(100));
    expect(root?.outerHTML).toBe(content$.value);
    expect(repeatLife$.value).toBe('mounted');
    await addRemoveTest();

    toggler$.value = false;
    await lastValueFrom(timer(100));
    expect(root?.outerHTML).toBe(content$.value);
    expect(repeatLife$.value).toBe('unmounted');
    await addRemoveTest();

    toggler$.value = true;
    await lastValueFrom(timer(100));
    expect(root?.outerHTML).toBe(content$.value);
    expect(repeatLife$.value).toBe('mounted');
    await addRemoveTest();

    toggler$.value = false;
    await lastValueFrom(timer(100));
    expect(root?.outerHTML).toBe(content$.value);
    expect(repeatLife$.value).toBe('unmounted');
    await addRemoveTest();
  });
  test('if-else:repeat:from-true', async () => {
    const toggler$ = ref$(true);
    const array$ = ref$(['One', 'Two', 'Three']);
    const onLifecycleChange = createEvent<LifecycleStatuses>();
    const repeatLife$ = ref$(onLifecycleChange.listener$);

    const arrayHtml$ = ref$(() =>
      array$.value.map((i) => `<span>${i}</span>`).join(''),
    );
    const content$ = ref$(
      () =>
        `<div id="app">${
          toggler$.value ? `<h3>Repeat</h3>${arrayHtml$.value}` : ''
        }</div>`,
    );

    const root = await createApp(ifElseRepeat, {
      toggler$,
      array$,
      lifecycleChanged: onLifecycleChange.emitter,
    }).mount('#app');

    // let tryNumb = 0;
    const addRemoveTest = async () => {
      // tryNumb += 1;
      // console.log(`${tryNumb}-st check`);

      array$.patch((arr) => {
        arr.push('Four');
      });
      await lastValueFrom(timer(100));
      expect(root?.outerHTML).toBe(content$.value);
      array$.patch((arr) => {
        arr.pop();
      });
      await lastValueFrom(timer(100));
      expect(root?.outerHTML).toBe(content$.value);
    };

    expect(root?.outerHTML).toBe(content$.value);
    expect(repeatLife$.value).toBe('mounted');
    await addRemoveTest();

    toggler$.value = false;
    await lastValueFrom(timer(100));
    expect(root?.outerHTML).toBe(content$.value);
    expect(repeatLife$.value).toBe('unmounted');
    await addRemoveTest();

    toggler$.value = true;
    await lastValueFrom(timer(100));
    expect(root?.outerHTML).toBe(content$.value);
    expect(repeatLife$.value).toBe('mounted');
    await addRemoveTest();

    toggler$.value = false;
    await lastValueFrom(timer(100));
    expect(root?.outerHTML).toBe(content$.value);
    expect(repeatLife$.value).toBe('unmounted');
    await addRemoveTest();

    toggler$.value = true;
    await lastValueFrom(timer(100));
    expect(root?.outerHTML).toBe(content$.value);
    expect(repeatLife$.value).toBe('mounted');
    await addRemoveTest();
  });
  test('input-text-test', async () => {
    const content = 'He,Wo'
      .split('')
      .map((i) => `<div>Letter -<!--end of text--><b> ${i}</b></div>`)
      .join('');

    const root = await createApp(inputTextTest).mount('#app');
    const expectedContent =
      `<div id="app">` +
      `<div>` +
      `<h3>Text inputs</h3>` +
      `<div>` +
      `<input type="text">` +
      `<input style="margin-left: 1rem;" type="text">` +
      `<input style="margin-left: 1rem;" type="text">` +
      `</div>` +
      `<h4>He, Wo</h4>` +
      `<div>${content}</div>` +
      `</div>` +
      `</div>`;

    expect(root?.outerHTML).toBe(expectedContent);
  });
  test('class binding', async () => {
    const class$ = ref$<ClassBinding>('foo');
    const style$ = ref$<CssProperties | string>({
      marginLeft: '1rem',
    });

    const root = await createApp(classBindingTest, {
      class: class$,
      style: style$,
    }).mount('#app');
    expect(root?.outerHTML).toBe(
      '<div id="app">' +
        '<div class="target foo" style="padding: 1rem; margin-left: 1rem;"></div>' +
        '</div>',
    );
    class$.value = ['foo', 'bar'];
    style$.value = 'gap: 10px;';
    expect(root?.outerHTML).toBe(
      '<div id="app">' +
        '<div class="target foo bar" style="padding: 1rem; gap: 10px;"></div>' +
        '</div>',
    );
    class$.value = { foo: true, bar: false, baz: true };
    style$.value = {
      marginRight: '2rem',
    };
    expect(root?.outerHTML).toBe(
      '<div id="app">' +
        '<div class="target foo baz" style="padding: 1rem; margin-right: 2rem;"></div>' +
        '</div>',
    );
  });
});
