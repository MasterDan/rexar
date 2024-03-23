# Conditional Rendering

<script setup >
import Demo from '../../components/tools/Demo.vue'
import { ifElseExample } from '../../components/en/conditional-rendering/IfElseExample.tsx'
import { IfElseExampleAdvanced } from '../../components/en/conditional-rendering/IfElseExampleAdvanced.tsx'
import { SwitchCaseExample } from '../../components/en/conditional-rendering/SwitchCaseExample.tsx'
</script>

## Simple Flag

For conditional rendering we can use `Show` component. Properties of this component are:
  * `when`: `boolean` | `Observable<boolean>` | `() => boolean` - condition
  * `content`: ` () => JSX.Element` | `undefined` - content to render if condition is true
  * `fallback`: ` () => JSX.Element` | `undefined` - content to render if condition is false

Let's see the example:

<<< ../../components/en/conditional-rendering/IfElseExample.tsx{11-15 tsx:line-numbers}
<Demo :is="ifElseExample" />

## Nested Show Coponents

This is example how `Show` component can be nested

<<< ../../components/en/conditional-rendering/IfElseExampleAdvanced.tsx{20-30 tsx:line-numbers}
<Demo  :is="IfElseExampleAdvanced" />

## Switch/Case alternative

We can also use `useSwitch` function. Pass in the `observable` and  receive `Switch` component with props
 * `setup`: `( setCase ) => void` - factory function that takes `setCase` function as argument.
   * `setCase` : `(condition: T | (value:T) => boolean, content: ()=> JSX.Element) => void` - use this function to define each case
 * `default`: `() => JSX.ELement` | `undefined` - content that will be rendered if all provided cases are not valid


<<< ../../components/en/conditional-rendering/SwitchCaseExample.tsx{8,18-33 tsx:line-numbers}
<Demo  :is="SwitchCaseExample" />