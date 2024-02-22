import { defineComponent, ref, fragment, h } from '@rexar/core';

export const SimpleDataExample = defineComponent(() => {
  const number = 12;
  const string = 'Hello, World';
  const boolean = true;
  const numberRef = ref(1);
  const stringRef = ref('Hello, World');
  const booleanRef = ref(true);
  return (
    <>
      <div>
        <h3 style={{ marginTop: '0' }}>Numbers</h3>
        <div>reactive: {numberRef}</div>
        <div>reactive: {() => numberRef.value}</div>
        <div>reactive x2 : {() => numberRef.value * 2}</div>
        <div>non reactive: {numberRef.value}</div>
      </div>
      <button
        onClick={() => {
          numberRef.value += 1;
        }}
      >
        Increment
      </button>
      <div>
        <h3>Strings</h3>
        <div>reactive: {stringRef}</div>
        <div>reactive: {() => stringRef.value}</div>
        <div>non reactive: {stringRef.value}</div>
        <div>reactive uppercase: {() => stringRef.value.toUpperCase()}</div>
        <div>non reactive uppercase: {stringRef.value.toUpperCase()}</div>
        <div>reactive length: {() => stringRef.value.length}</div>
        <div>non reactive length: {stringRef.value.length}</div>
      </div>
      <input
        type="text"
        value={stringRef}
        onInput={(e) => {
          stringRef.value = (e.target as HTMLInputElement).value;
        }}
      />
      <div>
        <h3>Booleans</h3>
        <div>reactive: {booleanRef}</div>
        <div>reactive: {() => (booleanRef.value ? 'Yes' : 'No')}</div>
        <div>non reactive: {booleanRef.value}</div>
      </div>
      <button
        onClick={() => {
          booleanRef.value = !booleanRef.value;
        }}
      >
        Toggle
      </button>
      <div>
        <h3>Raw Values</h3>
        <i>Raw variables are all non-reactive</i>
        <div>Number: {number}</div>
        <div>Number: {5}</div>
        <div>Number: {5 ** 2}</div>
        <div>String: {string}</div>
        <div>String Uppercase: {string.toUpperCase()}</div>
        <div>String: {'Other String'}</div>
        <div>Boolean: {boolean}</div>
        <div>Boolean: {boolean ? 'Yes' : 'No'}</div>
        <div>Boolean: {true}</div>
        <div>Boolean: {false}</div>
      </div>
    </>
  );
});
