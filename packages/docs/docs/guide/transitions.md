# Animations and transitions

<script setup>
import Demo from '../../components/tools/Demo.vue'
import { TransitionFadeExample } from '../../components/en/transitions/TransitionFadeExample.tsx'
import { TransitionFadeInShow } from '../../components/en/transitions/TransitionFadeInShow.tsx'

</script>

## Fade Transition Example

::: tabs

== fade.transition.ts

<<< ../../components/en/transitions/fade.transition.ts{ts:line-numbers}

== fade.transition.module.css
<<< ../../components/en/transitions/fade.transition.module.css{css:line-numbers}

:::

<<< ../../components/en/transitions/TransitionFadeExample.tsx{tsx:line-numbers}

<Demo align-start :is="TransitionFadeExample" />

## Transitions inside Show Component

<<< ../../components/en/transitions/TransitionFadeInShow.tsx{tsx:line-numbers}

<Demo align-start :is="TransitionFadeInShow" />