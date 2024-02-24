import { defineComponent, h, fragment } from '@rexar/core';
import { Subject, debounceTime, throttleTime } from 'rxjs';
import { Emitter } from './Emitter2';

export const Subscriber = defineComponent(() => {
  const event$ = new Subject<string>();
  const eventDebounced$ = event$.pipe(debounceTime(500));
  const eventThrottled$ = event$.pipe(throttleTime(500));
  return (
    <>
      <Emitter onEvent={event$}></Emitter>
      <span>Latest emitted value is: {event$}</span>
      <span>Same debounced (500 ms): {eventDebounced$}</span>
      <span>Same throttled (500 ms): {eventThrottled$}</span>
    </>
  );
});
