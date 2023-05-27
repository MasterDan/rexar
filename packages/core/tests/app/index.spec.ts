import { createApp } from '@core/app';
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
});
