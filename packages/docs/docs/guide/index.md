# Getting Started

First you need to install RxJS

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

Then install Rexar

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
import Card from '../../components/tools/Card.vue'
import CounterApp from '../../components/en/getting-started/CounterApp.vue'
import CounterAppAlt from '../../components/en/getting-started/CounterAppAlt.vue'
</script>

Example

<<< @../../components/en/getting-started/CounterApp.template.html{html:line-numbers}
<<< @../../components/en/getting-started/CounterApp.setup.tsx{tsx:line-numbers}
<Card>
    <CounterApp/>
</Card>


Example

<<< @../../components/en/getting-started/CounterAppAlt.template.html{html:line-numbers}
<<< @../../components/en/getting-started/CounterAppAlt.setup.tsx{tsx:line-numbers}
<Card>
    <CounterAppAlt/>
</Card>