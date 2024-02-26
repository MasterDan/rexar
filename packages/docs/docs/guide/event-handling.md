# Subscribing Events

<script setup>
import Demo from '../../components/tools/Demo.vue'
import { Subscriber } from '../../components/en/event-handling/Subscriber.tsx'
import { Subscriber as Subscriber2 } from '../../components/en/event-handling/Subscriber2.tsx'
</script>

## Using Function

<<< ../../components/en/event-handling/Emitter.tsx{tsx:line-numbers}
<<< ../../components/en/event-handling/Subscriber.tsx{tsx:line-numbers}
<Demo  align-start :is="Subscriber" />

## Using RxJs Subject

<<< ../../components/en/event-handling/Emitter2.tsx{tsx:line-numbers}
<<< ../../components/en/event-handling/Subscriber2.tsx{tsx:line-numbers}
<Demo  align-start :is="Subscriber2" />