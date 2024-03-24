import { defineComponent, h, fragment, ref, useEvent } from '@rexar/core';
import { debounceTime, throttleTime } from 'rxjs';
import { Emitter } from './UseEvent.Emitter';

export const Subscriber = defineComponent(() => {
  const [event$, triggerEvent] = useEvent<string>();
  // We can create observables from events
  const eventDebounced$ = event$.pipe(debounceTime(500));
  // Or we can subscribe in more traditional way
  const eventThrottled$ = ref<string>();
  event$.pipe(throttleTime(500)).subscribe((e) => {
    eventThrottled$.value = e;
  });
  // reset event
  const [reset$, reset] = useEvent();
  return (
    <>
      <Emitter onEvent={triggerEvent} reset$={reset$}></Emitter>
      <span>Latest emitted value is: {event$}</span>
      <span>Same, but debounced (500 ms): {eventDebounced$}</span>
      <span>Same, but throttled (500 ms): {eventThrottled$}</span>
      <button onClick={() => reset()}>Reset Counter</button>
    </>
  );
});
