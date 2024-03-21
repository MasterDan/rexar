# Conditional Rendering

<script setup >
import Demo from '../../components/tools/Demo.vue'
import { ifElseExample } from '../../components/en/conditional-rendering/IfElseExample.tsx'
import { IfElseExampleAdvanced } from '../../components/en/conditional-rendering/IfElseExampleAdvanced.tsx'
import { SwitchCaseExample } from '../../components/en/conditional-rendering/SwitchCaseExample.tsx'
</script>

## Simple Flag

For conditional rendering we can use `Show` component

This approach allows us to name components in more speakable way.

Let's see the example:

<<< ../../components/en/conditional-rendering/IfElseExample.tsx{11-15 tsx:line-numbers}
<Demo :is="ifElseExample" />

## Else-if logic example

To implement `else-if` logic, take `elseIf` function and use it.  
Let's detect ranges of already known counter. See the example:

<<< ../../components/en/conditional-rendering/IfElseExampleAdvanced.tsx{20-30 tsx:line-numbers}
<Demo  :is="IfElseExampleAdvanced" />

## Switch/Case alternative

We can also use `useSwitch` function. Pass in the `observable` and receive three components
* `Switch` 


::: info
Order of `Case` components in template is important.  
Order of checking values (or predicates) depends on order os `Cases` in jsx markup.
:::

<<< ../../components/en/conditional-rendering/SwitchCaseExample.tsx{8,18-33 tsx:line-numbers}
<Demo  :is="SwitchCaseExample" />

---
::: info
Both `useIf` and `useSwitch` functions are tree-shakeable.
:::