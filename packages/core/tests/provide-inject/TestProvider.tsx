import { defineComponent } from '@core/component';
import { Ref, ref } from '@rexar/reactivity';
import { createProvider, onMounted } from '@core/scope';
import { delay } from 'rxjs';
import { useDefaultValues } from '@core/component/tools';

export const messageProvider = createProvider<string>('No Message');

export const messageRefProvider = createProvider<Ref<string>>(
  ref('No Message'),
);

export const TestProvider = defineComponent<{
  content: () => JSX.Element;
  message?: string;
}>((props) => {
  const { content: Content, message } = useDefaultValues(props, {
    message: () => 'Hello World',
  });
  messageProvider.provide(message);
  const reactiveMessage$ = ref('Reactive Message');
  messageRefProvider.provide(reactiveMessage$);
  onMounted()
    .pipe(delay(500))
    .subscribe(() => {
      reactiveMessage$.value = 'Message Changed';
    });
  return <Content />;
});

