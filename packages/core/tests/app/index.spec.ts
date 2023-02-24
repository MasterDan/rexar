import { createApp } from '@core/app';
import { testOne } from './components/test-one/test-one.component';

describe('custom components', () => {
  test('test-one', async () => {
    const elApp = await createApp(testOne.create()).mount('#app');
    console.log(elApp?.outerHTML);
  });
});
