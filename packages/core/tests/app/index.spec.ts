import { createApp } from '@core/app';
import { ref$ } from '@core/reactivity/ref';
import { lastValueFrom, timer } from 'rxjs';
import { ifElseRepeat } from './components/if-else.test/if-else-repeat.component';
import { ifElseSotsTest } from './components/if-else.test/if-else-slots-test.component';
import { ifElseTest } from './components/if-else.test/if-else-test.component';
import { repeatComponent } from './components/repeat/repeat.component';
import { slotTest } from './components/slot-test/slot-test.component';
import { testOne } from './components/test-one/test-one.component';
import { testThree } from './components/test-three/test-three.component';
import { testTwo } from './components/test-two/test-two.component';

describe('custom components', () => {
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
    await lastValueFrom(timer(100));
    expect(root?.outerHTML).toBe(content.positive);
  });
  test('if-else:slots', async () => {
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
  });
  test('if-else:repeat', async () => {
    const toggler$ = ref$(false);
    const array$ = ref$(['One', 'Two', 'Three']);
    const arrayHtml$ = ref$(() =>
      array$.value.map((i) => `<span>${i}</span>`).join(''),
    );
    const content$ = ref$(
      () =>
        `<div id="app">${
          toggler$.value ? `<h3>Repeat</h3>${arrayHtml$.value}` : ''
        }</div>`,
    );
    content$.subscribe((c) => console.log('content is:', c));
    const root = await createApp(ifElseRepeat, { toggler$, array$ }).mount(
      '#app',
    );

    expect(root?.outerHTML).toBe(content$.value);
    toggler$.value = true;
    await lastValueFrom(timer(100));
    expect(root?.outerHTML).toBe(content$.value);
    toggler$.value = false;
    await lastValueFrom(timer(100));
    expect(root?.outerHTML).toBe(content$.value);
    toggler$.value = true;
    await lastValueFrom(timer(100));
    expect(root?.outerHTML).toBe(content$.value);
  });
});
