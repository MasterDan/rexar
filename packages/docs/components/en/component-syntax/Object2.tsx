import { defineComponent, ref, computed, toRefs } from '@rexar/core';
import { map } from 'rxjs';

export const ObjectExample = defineComponent(() => {
  const person$ = ref({ name: 'John', surname: 'Doe' });
  const { name: name$, surname: surname$ } = toRefs(person$);

  const fullNameComputed$ = computed(
    () => `${person$.value.name} ${person$.value.surname}`
  );
  const fullName$ = person$.pipe(map((p) => `${p.name} ${p.surname}`));

  return (
    <>
      <div>
        <h3>Name</h3>
        <div>reactive: {name$}</div>
        <div>reactive: {() => name$.value}</div>
        <div>reactive: {() => person$.value.name}</div>
        <div>non Reactive: {person$.value.name}</div>
        <div>non Reactive: {name$.value}</div>
        <input
          type="text"
          value={name$}
          onInput={(e) => {
            name$.value = (e.target as HTMLInputElement).value;
          }}
        />
      </div>
      <div>
        <h3>Surname</h3>
        <div>reactive: {surname$}</div>
        <div>reactive: {() => surname$.value}</div>
        <div>reactive: {() => person$.value.surname}</div>
        <div>non Reactive: {person$.value.surname}</div>
        <div>non reactive: {surname$.value}</div>
        <input
          type="text"
          value={surname$}
          onInput={(e) => {
            surname$.value = (e.target as HTMLInputElement).value;
          }}
        />
      </div>
      <div>
        <h3>Full Name</h3>
        <div>computed: {fullNameComputed$}</div>
        <div>observable: {fullName$}</div>
        <div>
          inPlace: {() => person$.value.name} {() => person$.value.surname}
        </div>
        <div>
          inPlace: {name$} {surname$}
        </div>
      </div>
    </>
  );
});
