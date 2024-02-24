# Event Handling

<script setup>
import Demo from '../../components/tools/Demo.vue'
import { Subscriber } from '../../components/en/event-handling/Subscriber.tsx'
import { Emitter } from '../../components/en/event-handling/Emitter.tsx'
</script>

## Using Function

<<< ../../components/en/event-handling/Emitter.tsx{tsx:line-numbers}
<<< ../../components/en/event-handling/Subscriber.tsx{tsx:line-numbers}
<Demo  align-start :is="Subscriber" />