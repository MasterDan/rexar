# Animations and transitions

<script setup>
import Demo from '../../components/tools/Demo.vue'
import { TransitionFadeExample } from '../../components/en/transitions/TransitionFadeExample.tsx'
import { TransitionFadeAppearExample } from '../../components/en/transitions/TransitionFadeAppearExample.tsx'

</script>

::: tabs

== fade.transition.ts

<<< ../../components/en/transitions/fade.transition.ts{ts:line-numbers}

== transitions.module.css
<<< ../../components/en/transitions/transitions.module.css{css:line-numbers}

:::

<<< ../../components/en/transitions/TransitionFadeExample.tsx{tsx:line-numbers}

<Demo align-start :is="TransitionFadeExample" />

