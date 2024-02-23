import { defineComponent, ref, fragment, h, computed } from '@rexar/core';
import { map } from 'rxjs';

export const ObjectExample = defineComponent(() => {
  const person = ref({ name: 'John', surname: 'Doe' });

  const fullNameComputed = computed(
    () => `${person.value.name} ${person.value.surname}`
  );
  const fullNameObservable = person.pipe(map((p) => `${p.name} ${p.surname}`));

  return (
    <>
      <div>
        <h3>Name</h3>
        <div>reactive: {() => person.value.name}</div>
        <div>non Reactive: {person.value.name}</div>
        <input
          type="text"
          value={() => person.value.name}
          onInput={(e) => {
            person.value.name = (e.target as HTMLInputElement).value;
          }}
        />
      </div>
      <div>
        <h3>Surname</h3>
        <div>reactive: {() => person.value.surname}</div>
        <div>non Reactive: {person.value.surname}</div>
        <input
          type="text"
          value={() => person.value.surname}
          onInput={(e) => {
            person.value.surname = (e.target as HTMLInputElement).value;
          }}
        />
      </div>
      <div>
        <h3>Full Name</h3>
        <div>computed: {fullNameComputed}</div>
        <div>observable: {fullNameObservable}</div>
        <div>
          inPlace: {() => person.value.name} {() => person.value.surname}
        </div>
      </div>
    </>
  );
});
