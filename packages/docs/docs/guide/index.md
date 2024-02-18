# Getting Started

## Installing packages

First you need to install RxJS.

:::tabs key:packages
== npm
```sh
npm i rxjs
```
== yarn
```sh
yarn add rxjs
```
:::

Then install Rexar.

:::tabs key:packages
== npm
```sh
npm i @rexar/core
```
== yarn
```sh
yarn add @rexar/core
```
:::

<script setup>
import Demo from '../../components/tools/Demo.vue'
import { Counter } from '../../components/en/getting-started/Counter.tsx'
import { Counter as CounterAlt } from '../../components/en/getting-started/CounterAlt.tsx'
import { Timer } from '../../components/en/getting-started/Timer.tsx'
</script>

## Creating First Component

Add some container element to your html template.

<<< @../../components/en/getting-started/Counter.template.html{html:line-numbers}  
Then define Component by using defineComponent function.

<<< @../../components/en/getting-started/Counter.tsx{tsx:line-numbers}  
Then render it to your container element.

<<< @../../components/en/getting-started/Counter.setup.ts{ts:line-numbers}

And here is our counter!
<Demo :is="Counter" />

### What is going on here?

- **Reactivity**: We use `ref` as simle reactive primitive, that tracks changes of it's value.  
  And that's the way how `rexar` applies changes to DOM.  
  Our reactivity system is built on top of [RxJs](https://rxjs.dev/) library. You can use any [observable](https://rxjs.dev/guide/observable) inside `jsx` markup. Not only `ref`.
- **No Virtual DOM**: thanks to reactivity system, we don't need to use virtual DOM for detecting changes. Every component renders only once.

## RxJS Observable example

Here is example of using `RxJs observable` inside `jsx` markup.  
For this example we are using [timer](https://rxjs.dev/api/index/function/timer) and a few operators to beautify output.

<<< @../../components/en/getting-started/Timer.tsx{tsx:line-numbers}
<Demo :is="Timer" />

Alternative Example

<<< @../../components/en/getting-started/CounterAlt.tsx{tsx:line-numbers}
<Demo :is="CounterAlt" />
