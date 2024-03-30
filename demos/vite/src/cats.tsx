import {
  defineComponent,
  useFor,
  ref,
  computed,
  Show,
  toRefs,
} from '@rexar/core';
import { Input } from './input';

type Cat = { name: string; age: number };

export const CatsApp = defineComponent(() => {
  const cats = ref<Cat[]>([{ name: 'Tina', age: 12 }]);

  const newCat = ref<Cat>({ name: '', age: 0 });
  const newCatName = computed(
    () => newCat.value.name,
    (name) => {
      newCat.value.name = name ?? '';
    },
  );

  const newCatAge = computed(
    () => newCat.value.age,
    (age) => {
      newCat.value.age = age ?? 0;
    },
  );
  const createCat = () => {
    cats.value.push(newCat.value);
    newCat.value = { name: '', age: 0 };
  };

  const setDefaultCat = () => {
    newCat.value = { name: 'Tom', age: 3 };
  };

  const Cats = useFor<Cat>(cats, (i, n) => `${i.name}${i.age},${n}`);

  const canCreate = computed(
    () => newCat.value.name.length > 0 && newCat.value.age > 0,
  );

  const cantCreate = computed(() => !canCreate.value);

  const removeCat = (index: number) => {
    cats.value = cats.value.filter((_, n) => n !== index);
  };

  return (
    <>
      <Show
        when={() => cats.value.length === 0}
        content={() => <h2 class="text-4xl">No cats in list</h2>}
        fallback={() => (
          <h2
            class="text-4xl 
        text-transparent 
        bg-gradient-to-r from-purple-800 to-indigo-700 
        bg-clip-text"
          >
            Cats
          </h2>
        )}
      />

      <Cats
        each={({ item: cat, index }) => {
          const { name, age } = toRefs(cat);

          return (
            <div class="bg-neutral-50 rounded-3xl bg-opacity-25 p-4 flex flex-col  gap-4 ">
              <h3 class="self-center text-xl">
                {() => index.value + 1}: {name}
              </h3>
              <p>
                This is{' '}
                <Show
                  when={() => age.value > 10}
                  content={() => <>old</>}
                ></Show>{' '}
                {name}, who is {age} years old
              </p>
              <button
                class="self-center bg-indigo-400 hover:bg-indigo-600 active:bg-indigo-500
           text-white p-2 px-4 rounded-full transition-colors duration-200"
                onClick={() => removeCat(index.value)}
              >
                Remove {name}
              </button>
            </div>
          );
        }}
      ></Cats>
      <div class="bg-neutral-50 rounded-3xl bg-opacity-25 p-4 flex flex-col items-center gap-4 mb-16">
        <div class="text-lg">Name is "{newCatName}"</div>
        <div class="flex items-center justify-between gap-4">
          <Input label="Name" model={newCatName}></Input>
          <Input label="Name Clone" model={newCatName}></Input>
        </div>
        <div class="text-lg">Age is: {newCatAge}</div>
        <div class="flex items-center justify-between gap-4">
          <Input label="Age" model={newCatAge}></Input>
          <Input label="Age Clone" model={newCatAge}></Input>
        </div>
        <div class="self-end flex gap-4">
          <button
            class="bg-indigo-400 hover:bg-indigo-600 active:bg-indigo-500
           text-white p-2 px-4 rounded-full transition-colors duration-200"
            disabled={cantCreate}
            onClick={createCat}
          >
            <Show
              when={cantCreate}
              content={() => <>Enter Name and Age</>}
              fallback={() => <>Create {newCatName}</>}
            ></Show>
          </button>
          <button
            class="bg-sky-500 hover:bg-sky-700 active:bg-sky-600
           text-white p-2 px-4 rounded-full transition-colors duration-200"
            onClick={setDefaultCat}
          >
            Tom
          </button>
        </div>
      </div>
    </>
  );
});
