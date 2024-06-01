# Animations and transitions

<script setup>
import Demo from '../../components/tools/Demo.vue'
import { TransitionFadeExample } from '../../components/en/transitions/TransitionFadeExample.tsx'
import { TransitionRotateExample } from '../../components/en/transitions/TransitionRotateExample.tsx'
import { TransitionFadeInShow } from '../../components/en/transitions/TransitionFadeInShow.tsx'
import { TransitionFadeInShowNested } from '../../components/en/transitions/TransitionFadeInShowNested.tsx'

</script>

## Fade Transition Example

This is how we creating transitions. First, you need to call `createTransition` function.  
Then, using  methods `withState` and `withTransition` we are creating `states` and `transitions` between them.

::: info
Every transition has it's default state. By default, it's `'default'`. This key exists in every transition.  
You can change defaults state, using `withDefault` method, when creating transition. 
This method creates new copy of transition - so you are able to create many transitions with just different default state.
:::

Both states and transitions are just css classes.  
`Transition` classes will be attached to element when transition starts and removed when transition ends.

Then we creating component, that will use our transition using `createTransitionComponent` function.

::: tabs
== fade.transition.ts
<<< ../../components/en/transitions/fade.transition.ts{ts:line-numbers}

== fade.transition.module.css
<<< ../../components/en/transitions/fade.transition.module.css{css:line-numbers}
:::

Out `TransitionFade` component will have next prop
 * `state` - state of your transition. In our example could be `'default' | 'void'`.
   * Also it could be `Observable<'default' | 'void'>` or `() => 'default' | 'void'`
   * Change state (if you provided `Observable` or arrow function) and you will see the animation
   * Default value of `state` property will be `'default'`
 * `initialState` state of your transition before it will bind to `state` prop.
   * This property is **not** reactive. Only strict value is acceptable. 
   * Default value is `undefined`
   * Useful when you want to play animation at very beginning
   * In our example if `initialState` is `void` our element will appear on start with animation.
 * `waiter` 
   * Special property to link your transition with other components, such as [`Show`](./conditional-rendering.md)
   * We'll discuss it later

Let's see the example.

<<< ../../components/en/transitions/TransitionFadeExample.tsx{28-30,34-36,40-45 tsx:line-numbers}

<Demo align-start :is="TransitionFadeExample" />

## Transition Rotate example

Pay attention, that in `rotate.transition.ts` we are using special `*` state and `reverse` flag to simplify creation of our transition.
See the example.

::: tabs
== TransitionRotateExample.tsx

<<< ../../components/en/transitions/TransitionRotateExample.tsx{17-19 tsx:line-numbers}

== rotate.transition.ts
<<< ../../components/en/transitions/rotate.transition.ts{ts:line-numbers}

== rotate.transition.module.css
<<< ../../components/en/transitions/rotate.transition.module.css{css:line-numbers}
:::

<Demo align-start :is="TransitionRotateExample" />


## Transitions inside Show Component

Every transition has state, called `'void'`.
This is special state, that can be used by other components to play animation before removing your element.

`Show` component props `content` and `fallback` both provides `waiter` argument.  
So we can take it and attach to our transition component. And it's state will be set to `'void'` before remove.

::: info
It is possible to pass many different transitions inside `content` (or `fallback`) and pass `waiter` prop into all of them. 
:::

::: tabs
== TransitionFadeInShow.tsx
<<< ../../components/en/transitions/TransitionFadeInShow.tsx{16,18,22,23 tsx:line-numbers}

== fade.transition.ts
<<< ../../components/en/transitions/fade.transition.ts{ts:line-numbers}

== fade.transition.module.css
<<< ../../components/en/transitions/fade.transition.module.css{css:line-numbers}
:::
<Demo align-start :is="TransitionFadeInShow" />

## Transitions inside Nested Show Component

`Show` component also has `waiter` prop which is useful when you're having nested `Show` components and want to play an animation on remove.

::: tabs
== TransitionFadeInShow.tsx
<<< ../../components/en/transitions/TransitionFadeInShowNested.tsx{tsx:line-numbers}

== fade.transition.ts
<<< ../../components/en/transitions/fade.transition.ts{ts:line-numbers}

== fade.transition.module.css
<<< ../../components/en/transitions/fade.transition.module.css{css:line-numbers}
:::

<Demo align-start :is="TransitionFadeInShowNested" />