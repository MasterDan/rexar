# Subscribing Events

<script setup>
import Demo from '../../components/tools/Demo.vue'
import { Counter } from '../../components/en/event-handling/Counter.tsx'
import { Counter as CounterAlt } from '../../components/en/event-handling/CounterAlt.tsx'
import { Subscriber } from '../../components/en/event-handling/Classic.Subscriber.tsx'
import { Subscriber as Subscriber2 } from '../../components/en/event-handling/Subject.Subscriber.tsx'
import { Subscriber as Subscriber3 } from '../../components/en/event-handling/UseEvent.Subscriber.tsx'
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

<<< ../../components/en/event-handling/Classic.Emitter.tsx{4,5,7,14 tsx:line-numbers}

And then just pass function from parent component.

<<< ../../components/en/event-handling/Classic.Subscriber.tsx{9-11 tsx:line-numbers}
<Demo  align-start :is="Subscriber" />

## User events with RxJs Subject

Also we can use `observables`, such as [Subject](https://rxjs.dev/guide/subject).  
Subjects can be used in both directions. In this example `event$` is emitting custom event to parent. Otherwise `reset$` is emitting event to child component, telling him to reset inner counter. See the demo:

<<< ../../components/en/event-handling/Subject.Emitter.tsx{5-7,12,14,16 tsx:line-numbers}

Here we are using multiple subscriptions on our `event$`: with debounce and with throttle.
Also `Subject` as `observable` can be placed in jsx directly.

<<< ../../components/en/event-handling/Subject.Subscriber.tsx{6,15,18,22 tsx:line-numbers}
<Demo  align-start :is="Subscriber2" />

## Using `useEvent` helper

Rexar also provides a `useEvent<T>` helper. It returns `[Observable<T>, (e:T) => void]`.  
* First is `observable` that user can only subscribe, but cannot do `next`.  
* Second is function, that emits the value of event.

Here is the same example as above, but using this helper.  
Now, as you can see, `Emitter` component can only emit it's event using `onEvent` function, and only subscribe to `reset$` event. 
See the demo:

<<< ../../components/en/event-handling/UseEvent.Emitter.tsx{5-7,12,14,16 tsx:line-numbers}

<<< ../../components/en/event-handling/UseEvent.Subscriber.tsx{6,15,18,22 tsx:line-numbers}
<Demo  align-start :is="Subscriber3" />