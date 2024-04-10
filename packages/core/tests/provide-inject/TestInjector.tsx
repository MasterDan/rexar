import { defineComponent } from '@core/component';
import { messageProvider, messageRefProvider } from './TestProvider';

export const TestInjector = defineComponent(() => {
  const message = messageProvider.inject();
  const message$ = messageRefProvider.inject();
  return (
    <div>
      <span>{message}</span>
      <span>{message$}</span>
    </div>
  );
});

