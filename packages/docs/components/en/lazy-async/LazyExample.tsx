import { defineComponent, defineLazyComponent, ref } from '@rexar/core';
import { take, timer } from 'rxjs';
// And here is our LazyComponent
const MessageLazy = defineLazyComponent(() =>
  import('./Message').then((m) => m.Message)
);
// And another one with loading fallback
const MessageLazyWithTimeoutAndLoader = defineLazyComponent(
  () => import('./Message').then((m) => m.Message),
  {
    timeout: 3000, // Component will not be displayed until this time is passed
    fallback: () => <div>Loading...</div>,
  }
);

export const LazyExample = defineComponent(() => {
  const message$ = ref('Hello, World');
  const interval$ = timer(0, 1000).pipe(take(4));
  return (
    <>
      <input
        type="text"
        value={message$}
        onInput={(e) => {
          message$.value = (e.target as HTMLInputElement).value;
        }}
      />
      <MessageLazy message$={message$} />
      <div>Seconds passed: {interval$}</div>
      <MessageLazyWithTimeoutAndLoader message$={message$} />
    </>
  );
});
