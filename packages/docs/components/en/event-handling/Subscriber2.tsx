import { defineComponent, h, fragment, ref } from '@rexar/core';
import { Subject, debounceTime, throttleTime } from 'rxjs';
import { Emitter } from './Emitter2';

export const Subscriber = defineComponent(() => {
  const event$ = new Subject<string>();
  // We can create observables from events
  const eventDebounced$ = event$.pipe(debounceTime(500));
  // Or we can subscribe in more traditional way
  const eventThrottled$ = ref<string>();
  event$.pipe(throttleTime(500)).subscribe((e) => {
    eventThrottled$.value = e;
  });
  return (
    <>
      <Emitter onEvent={event$}></Emitter>
      <span>Latest emitted value is: {event$}</span>
      <span>Same, but debounced (500 ms): {eventDebounced$}</span>
      <span>Same, but throttled (500 ms): {eventThrottled$}</span>
    </>
  );
});
