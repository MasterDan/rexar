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
== pnpm
```sh
pnpm add rxjs
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
== pnpm
```sh
pnpm add @rexar/core
```
:::

<script setup>
import Demo from '../../components/tools/Demo.vue'
import { Counter } from '../../components/en/getting-started/Counter.tsx'
</script>

## Typescript settings

Add this `jsx options` in your `tsconfig.json` if you're using typescript.

```jsonc
{
  // ...
    "compilerOptions": {
    // other options
    "jsx": "react",
    "jsxFactory": "h",
    "jsxFragmentFactory": "fragment"
  }
  // ...
}
```

## Creating First Component

Add some container element to your html template.

<<< ../../components/en/getting-started/Counter.template.html{html:line-numbers}  
Then define `Component` by using `defineComponent` function.

<<< ../../components/en/getting-started/Counter.tsx{tsx:line-numbers}  
Then `render` your component `into` your container element.

<<< ../../components/en/getting-started/Counter.setup.ts{ts:line-numbers}

And here is our counter!
<Demo :is="Counter" />

Let's pay attention on some features of `rexar` in example above:
- **Reactivity**: We use `ref` as simle reactive primitive, that tracks changes of it's value.  
  And that's the way how `rexar` applies changes to DOM.  
  Our reactivity system is built on top of [RxJs](https://rxjs.dev/) library. You can use any [observable](https://rxjs.dev/guide/observable) inside `jsx` markup. Not only `ref`.
- **No Virtual DOM**: thanks to reactivity system, we don't need to use virtual DOM for detecting changes. Every component renders only once.
