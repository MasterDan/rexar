import { createApp } from '@core/app';
import { testOne } from './components/test-one/test-one.component';
import { testTwo } from './components/test-two/test-two.component';

describe('custom components', () => {
  test('test-one', async () => {
    const elApp = await createApp(testOne.create()).mount('#app');
    expect(elApp?.outerHTML).toBe(
      '<div id="app"><div><div>Lorem, ipsum dolor.\n' +
        '    </div><div>Necessitatibus, provident ut.\n' +
        '    </div><div>Minima, quae optio.\n' +
        '</div>\n' +
        '    </div></div>',
    );
  });
  test('test-two', async () => {
    const elApp = await createApp(testTwo.create()).mount('#app');
    expect(elApp?.outerHTML).toBe(
      '<div id="app"><div><div>Lorem, ipsum dolor.\n' +
        '    </div><div>middle text\n' +
        '    </div><div>Delectus, reiciendis illum.\n' +
        '</div>\n' +
        '    </div></div>',
    );
  });
});
