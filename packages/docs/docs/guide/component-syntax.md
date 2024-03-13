# Component Syntax


<script setup>
import Demo from '../../components/tools/Demo.vue'
import { Timer } from '../../components/en/component-syntax/Timer.tsx'
import { BehaviorSubjectExample } from '../../components/en/component-syntax/BehaviorSubjectExample.tsx'
import { Numbers } from '../../components/en/component-syntax/Numbers.tsx' 
import { NumbersAlt } from '../../components/en/component-syntax/NumbersAlt.tsx' 
import { Strings } from '../../components/en/component-syntax/Strings.tsx' 
import { Boolean } from '../../components/en/component-syntax/Boolean.tsx' 
import { ObjectExample } from '../../components/en/component-syntax/Object.tsx' 
import { ObjectExample as ObjectExample2 } from '../../components/en/component-syntax/Object2.tsx' 
import { ArrayExample } from '../../components/en/component-syntax/Array.tsx' 
import { MapExample } from '../../components/en/component-syntax/Map.tsx' 
import { SetExample } from '../../components/en/component-syntax/Set.tsx' 

</script>

## Using RxJS Observables

Here is example of using `RxJs observable` inside `jsx` markup.  
For this example we are using [timer](https://rxjs.dev/api/index/function/timer) and a few operators to beautify output.

<<< ../../components/en/component-syntax/Timer.tsx{5,10 tsx:line-numbers}
<Demo :is="Timer" />

Or in example below we implemented counter component using  [BehaviorSubject](https://rxjs.dev/api/index/class/BehaviorSubject) from `RxJs`. We can put it in our template as any observable.

<<< ../../components/en/component-syntax/BehaviorSubjectExample.tsx{tsx:line-numbers}
<Demo :is="BehaviorSubjectExample" />

## Numbers

Here is example of using numbers in template. Here we are using `ref`s again. `Ref` is `BehaviorSubject` with some additional functionality.
- `ref` tracks changes of it's `value` using [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), when `value` is not primitive type.
- `ref` is trackable, when using inside `computed` arrow functions.

In example below we are using `computed` for multiplying our number by 2. As you can see, it's reactive.
You can also place arrow function directly in template, this will create `computed` under hood. See the example.

And we also achieving same effect, creating `observable` using [map](https://rxjs.dev/api/operators/map) operator. This is a little bit faster, because we don't need to track values.

::: info
Placing `value` property of `ref` (or `BehaviorSubject`) like this...
```tsx
 <div>non reactive: {number$.value}</div>
```
 ...will loose reactivity. Instead just place `observable` itself like this:

```tsx
 <div>reactive: {number$}</div>
```
:::

<<< ../../components/en/component-syntax/Numbers.tsx{tsx:line-numbers}
<Demo align-start :is="Numbers" />

::: warning
In example above we created same `computed` twice

Here
```ts
 const numberX2 = computed(() => number$.value * 2);
```
And Here
```tsx
<div>reactive x2 (inPlace) : {() => number$.value * 2}</div>
```
This is only for demonstration. Pay attention on this in your code.  
It's always recommended to create `computed` once and then reuse it as many times as you want.
:::

## Same example, using RxJs BehaviorSubject

Here we are using [BehaviorSubject](https://rxjs.dev/api/index/class/BehaviorSubject) again.
Pay attention, that `computed` is not reactive with `BehaviorSubject`, because this is not trackable type.  
Pure `observable`, that multiplies our number, still works.
::: warning
Use only `ref`s inside `computed` arrow functions.
:::
You can also create `ref` from any `observable` (such as `BehaviorSubject`) using `toRef` method. And `computed` will be reactive again. See the example.



<<< ../../components/en/component-syntax/NumbersAlt.tsx{tsx:line-numbers}
<Demo align-start :is="NumbersAlt" />

## Strings

Same as with numbers
- `observables` are reactive
- arrow functions are reactive with `ref`s inside
- `computed` are reactive with `ref`s inside
- raw value is not reactive

<<< ../../components/en/component-syntax/Strings.tsx{tsx:line-numbers}
<Demo align-start :is="Strings" />

## Booleans

All the same advices are with boolean values. See the example.

<<< ../../components/en/component-syntax/Boolean.tsx{tsx:line-numbers}
<Demo align-start :is="Boolean" />

## Objects

Here is example of using object inside `ref`. 
Pay attention that we are not changing `value` of our `person` directly, only it's inner props. This is how `ref`'s tracking works. As being said above - `ref` using [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) for tracking changes.  
As you can see - all computed still reactive. And raw values are still not.

<<< ../../components/en/component-syntax/Object.tsx{tsx:line-numbers}
<Demo align-start :is="ObjectExample" />

## Deconstructing Refs with objects

We ca also use `toRefs` method to deconstruct `ref` with object inside. Here is the example.
As you can see, changing value of `name$` or `surname$` also changes `person$`.

<<< ../../components/en/component-syntax/Object2.tsx{13,24,31,33,39,46,48,60 tsx:line-numbers}
<Demo align-start :is="ObjectExample2" />


## Arrays

Here is simple array example. As you can see, `push` method don't break reactivity.
::: info
More examples, see in [list rendering](./list-rendering.md) section.
:::
<<< ../../components/en/component-syntax/Array.tsx{4,10,15 tsx:line-numbers}
<Demo align-start :is="ArrayExample" />

## Maps and Sets

Calling methods of `Map` inside `ref` also reactive.  
See the example:

<<< ../../components/en/component-syntax/Map.tsx{4,7,14 tsx:line-numbers}
<Demo align-start :is="MapExample" />

Same with `Set` inside `ref`:

<<< ../../components/en/component-syntax/Set.tsx{4,10,15 tsx:line-numbers}
<Demo align-start :is="SetExample" />
