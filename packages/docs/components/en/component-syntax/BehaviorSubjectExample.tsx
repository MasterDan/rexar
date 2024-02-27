import { defineComponent, h } from '@rexar/core';
import { BehaviorSubject } from 'rxjs';

export const BehaviorSubjectExample = defineComponent(() => {
  const counter$ = new BehaviorSubject(0);
  const increment = () => {
    counter$.next(counter$.value + 1);
  };
  return <button onClick={increment}>Counter is {counter$}</button>;
});
