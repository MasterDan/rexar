import { defineComponent, ref, fragment, h } from '@rexar/core';

export const Strings = defineComponent(() => {
  const string = ref('Hello, World');
  return (
    <>
      <div>
        <div>reactive: {string}</div>
        <div>reactive: {() => string.value}</div>
        <div>non reactive: {string.value}</div>
        <div>reactive uppercase: {() => string.value.toUpperCase()}</div>
        <div>non reactive uppercase: {string.value.toUpperCase()}</div>
        <div>reactive length: {() => string.value.length}</div>
        <div>non reactive length: {string.value.length}</div>
      </div>
      <input
        type="text"
        value={string}
        onInput={(e) => {
          string.value = (e.target as HTMLInputElement).value;
        }}
      />
    </>
  );
});
