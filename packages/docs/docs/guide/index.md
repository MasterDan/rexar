# Getting Started

## Try Rexar

To try Rexar, choose your bundler and execute commands below

::: tabs key:bundlers

== Vite
```sh
npx degit MasterDan/rexar/demos/vite my-rexar-app
```
```sh
cd my-rexar-app
```
```sh
npm i
```
```sh
npm run dev
```

== Parcel
```sh
npx degit MasterDan/rexar/demos/parcel my-rexar-app
```
```sh
cd my-rexar-app
```
```sh
npm i
```
```sh
npm run dev
```
:::

## Installing packages

First you need to install RxJS.

:::tabs key:pm
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

:::tabs key:pm
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

## Configuring JSX/TSX

This depends on what bundler you prefer:

::: tabs key:bundlers

== Vite

Add this to your `vite.config.ts` file.

```ts
import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsxInject: `import { h, Fragment } from '@rexar/core'`,
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
});
```
Add this to your `tsconfig.json` if you're using typescript:
```json
{
  "compilerOptions": {
    "jsx": "preserve",
  },
}
```
== Parcel

Add this to your `package.json`
```json
{
  "@parcel/resolver-default": {
    "packageExports": true
  }
}
```
Add this to your `tsconfig.json` if you're using typescript:
```json
{
    "compilerOptions": {
        "jsx": "react-jsx",
        "jsxImportSource": "@rexar/core"
    }
}
```

:::


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
