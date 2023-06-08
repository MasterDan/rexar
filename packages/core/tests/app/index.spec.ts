import { createApp } from '@core/app';
import { ref$ } from '@core/reactivity/ref';
import { lastValueFrom, timer } from 'rxjs';
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
  test('if-else', async () => {
    const toggler$ = ref$(false);
    const root = await createApp(ifElseTest, { toggler$ }).mount('#app');
    expect(root?.outerHTML).toBe('<div id="app"><h2>If Else Test</h2></div>');
    toggler$.value = true;
    await lastValueFrom(timer(100));
    expect(root?.outerHTML).toBe(
      '<div id="app">' +
        '<h2>If Else Test</h2>' +
        '<div>' +
        '<span>Simple html</span>' +
        '<div>And more</div>' +
        '</div>' +
        '</div>',
    );
    toggler$.value = false;
    await lastValueFrom(timer(100));
    expect(root?.outerHTML).toBe('<div id="app"><h2>If Else Test</h2></div>');
  });
});
