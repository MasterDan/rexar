import { defineComponent, ref } from '@rexar/core';
import { Subject, debounceTime, throttleTime } from 'rxjs';
import { Emitter } from './Subject.Emitter';

export const Subscriber = defineComponent(() => {
  const event$ = new Subject<string>();
  // We can create observables from events
  const eventDebounced$ = event$.pipe(debounceTime(500));
  // Or we can subscribe in more traditional way
  const eventThrottled$ = ref<string>();
  event$.pipe(throttleTime(500)).subscribe((e) => {
    eventThrottled$.value = e;
  });
  // This subject will trigger counter reset in child component
  const reset$ = new Subject<void>();
  return (
    <>
      <Emitter event$={event$} reset$={reset$}></Emitter>
      <span>Latest emitted value is: {event$}</span>
      <span>Same, but debounced (500 ms): {eventDebounced$}</span>
      <span>Same, but throttled (500 ms): {eventThrottled$}</span>
      <button onClick={() => reset$.next()}>Reset Counter</button>
    </>
  );
});
