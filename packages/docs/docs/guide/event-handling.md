# Subscribing Events

<script setup>
import Demo from '../../components/tools/Demo.vue'
import { Counter } from '../../components/en/event-handling/Counter.tsx'
import { Counter as CounterAlt } from '../../components/en/event-handling/CounterAlt.tsx'
import { Subscriber } from '../../components/en/event-handling/Subscriber.tsx'
import { Subscriber as Subscriber2 } from '../../components/en/event-handling/Subscriber2.tsx'
</script>

## Dom Events

To subscribe on DOM events just use prefix `on`.  
For demo, let's remember `Counter` component from very beginning of our guide:

<<< ../../components/en/event-handling/Counter.tsx{8-10 tsx:line-numbers}
<Demo   :is="Counter" />

## Dom Events with RxJs Subject

Another way to subscribe event is to pass [Subject](https://rxjs.dev/guide/subject) from `RxJs` library.  
This might be useful when you want to use `RxJs` operators, such as `throttleTime`, `debounceTime`, `distinctUntilChanged`, etc.

In this example we created `doubleClick$` observable - so our counter will be incremented only when user clicks on button twice.
See the demo:

<<< ../../components/en/event-handling/CounterAlt.tsx{7,21 tsx:line-numbers}
<Demo   :is="CounterAlt" />

## User Events

First way to implement user event in component is defining function prop.

<<< ../../components/en/event-handling/Emitter.tsx{4,5,7,14 tsx:line-numbers}

And then just pass function from parent component.

<<< ../../components/en/event-handling/Subscriber.tsx{9-11 tsx:line-numbers}
<Demo  align-start :is="Subscriber" />

## User events with RxJs Subject

Also we can use `observables`, such as [Subject](https://rxjs.dev/guide/subject).  
Subjects can be used in both directions. In this example `event$` is emitting custom event to parent. Otherwise `reset$` is emitting event to child component, telling him to reset inner counter. See the demo:

<<< ../../components/en/event-handling/Emitter2.tsx{5-7,12,14,16 tsx:line-numbers}

Here we are using multiple subscriptions on our `event$`: with debounce and with throttle.
Also `Subject` can be placed in jsx directly.

<<< ../../components/en/event-handling/Subscriber2.tsx{6,15,18,22 tsx:line-numbers}
<Demo  align-start :is="Subscriber2" />