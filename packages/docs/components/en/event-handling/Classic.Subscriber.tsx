import { defineComponent, h, fragment, ref } from '@rexar/core';
import { Emitter } from './Classic.Emitter';

export const Subscriber = defineComponent(() => {
  const latestEmitted$ = ref<string>();
  return (
    <>
      <Emitter
        onEvent={(e) => {
          latestEmitted$.value = e;
        }}
      ></Emitter>
      <span>Latest emitted vale is: {latestEmitted$}</span>
    </>
  );
});
