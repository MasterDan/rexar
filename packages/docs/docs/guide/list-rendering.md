# List Rendering

<script setup >
import Demo from '../../components/tools/Demo.vue'
import { List } from '../../components/en/list-rendering/List.tsx'
import { List as ListAdvanced } from '../../components/en/list-rendering/ListAdvanced.tsx'
</script>

## Simple List

For rendering arrays we are using `useFor` function. This function takes two arguments...
  1. `items` - array or `observable` array. 
  2. `key` - function that returns unique key for each item.

... and returns Component that will render your array. This component has property...
 * `each` - Function that renders each item.  
        ( { `item`: ref with your item, `index`: ref with index of item in array  } ) => `JSX.Element`.

Let's see how it works in simple array:

<<< ../../components/en/list-rendering/List.tsx{tsx:line-numbers}

<Demo  :is="List" />

## Advanced List

Here's more useful example, that creates table rows one by one using `Timer` and allows you to move rows and reverse whole array.

<<< ../../components/en/list-rendering/ListAdvanced.tsx{tsx:line-numbers}

<Demo  :is="ListAdvanced" />
---
::: info
`useFor` function is tree-shakeable. 
:::
