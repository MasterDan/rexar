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


Alternative Example

<<< @../../components/en/getting-started/CounterAlt.tsx{tsx:line-numbers}
<Demo :is="CounterAlt" />
