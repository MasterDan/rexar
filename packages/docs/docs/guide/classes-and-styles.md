# Styling components

<script setup>
import Demo from '../../components/tools/Demo.vue'
import { StylesExample } from '../../components/en/styles-and-classes/StylesExample.tsx'
import { ClassExample } from '../../components/en/styles-and-classes/ClassExample.tsx'
import { CssModuleExample } from '../../components/en/styles-and-classes/CssModuleExample.tsx'

</script>

## Inline Styles

There are two ways to inline style components:
 * using `observable` with `StyleAttributes` type (if using typescript)
 * using arrow function directly in attribute. 

Both are shown in example below:

::: warning
Remember, that only `Ref`s are trackable inside arrow functions.
:::

<<< ../../components/en/styles-and-classes/StylesExample.tsx{15-20,24-29,31 tsx:line-numbers}
<Demo :is="StylesExample" />

<<< ../../components/en/styles-and-classes/ClassExample.tsx{tsx:line-numbers}
<Demo :is="ClassExample" />

<<< ../../components/en/styles-and-classes/CssModuleExample.tsx{tsx:line-numbers}
<Demo :is="CssModuleExample" />
