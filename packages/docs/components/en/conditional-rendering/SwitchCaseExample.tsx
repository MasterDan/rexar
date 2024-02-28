import { defineComponent, ref, useSwitch, h } from '@rexar/core';

export const SwitchCaseExample = defineComponent(() => {
  const counter$ = ref(0);
  const increment = () => {
    counter$.value += 1;
  };
  const [Switch, Case, Default] = useSwitch(counter$);
  return (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
      }}
    >
      <button onClick={increment}>Counter is {counter$}</button>
      <Switch>
        <Case check={0}>Counter equals zero</Case>
        <Case check={1}>Counter equals one</Case>
        <Case check={3}>Counter equals three</Case>
        <Case check={(c) => c > 10}>Counter is greater than 10</Case>
        <Case check={(c) => c > 5}>Counter is greater than 5</Case>
        <Default>Counter is {counter$}</Default>
      </Switch>
    </div>
  );
});
