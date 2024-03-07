# Conditional Rendering

<script setup >
import Demo from '../../components/tools/Demo.vue'
import { ifElseExample } from '../../components/en/conditional-rendering/IfElseExample.tsx'
import { IfElseExampleAdvanced } from '../../components/en/conditional-rendering/IfElseExampleAdvanced.tsx'
import { SwitchCaseExample } from '../../components/en/conditional-rendering/SwitchCaseExample.tsx'
</script>

## Simple Flag

For conditional rendering we can use `useIf` function, that takes boolean `observable` (or arrow function) and returns:
  * Couple of components
    * `TruthComponent` - displays it's own `children` if condition is `true` 
    * `FalseComponent` - displays it's own `children` if condition is `false
  * `elseIf` function. Has same signature as `useIf` for implementing `else-if` logic.

This approach allows us to name components in more speakable way.

Let's see the example:

<<< ../../components/en/conditional-rendering/IfElseExample.tsx{8,12,13 tsx:line-numbers}
<Demo :is="ifElseExample" />

## Else-if logic example

To implement `else-if` logic, take `elseIf` function and use it.  
Let's detect ranges of already known counter. See the example:

<<< ../../components/en/conditional-rendering/IfElseExampleAdvanced.tsx{11,12,24-26 tsx:line-numbers}
<Demo  :is="IfElseExampleAdvanced" />

## Switch/Case alternative

We can also use `useSwitch` function. Pass in the `observable` and receive three components
* `Switch` - renders current `Case` or `Default` component.
* `Case` - has property `check`, that could be `value` or `predicate`. Displays it's own children if `check` matches `observable` ( or `true` if `predicate` being passed ).
* `Default` - displays it's own children if there is no matching `Case` to display.

::: warning
It's expected to use each `Switch` component  once.  
If you need more switches - create more switches with `useSwitch`.
:::

::: info
Order of `Case` components in template is important.  
Order of checking values (or predicates) depends on order os `Cases` in jsx markup.
:::

<<< ../../components/en/conditional-rendering/SwitchCaseExample.tsx{8,18-25 tsx:line-numbers}
<Demo  :is="SwitchCaseExample" />

---
::: info
Both `useIf` and `useSwitch` functions are tree-shakeable.
:::