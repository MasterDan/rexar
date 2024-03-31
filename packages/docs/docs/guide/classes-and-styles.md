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

<<< ../../components/en/styles-and-classes/StylesExample.tsx{13-18,22-27,29 tsx:line-numbers}
<Demo :is="StylesExample" />

## Importing Files

Here's example of defining css file and importing it into your component.

We also using `useClasses` helper function to compose our classes.  
Inside this function you may pass:
 * `observable` with `Array<string>`
 * `Array` with `Observable<string> | string | () => string`
 * Object with:
   * `key` - name of class
   * `value` - `boolean | Observable<boolean> | () => boolean` (Apply class or not)
 * `() => string[]`
 * `() => { [Key:string]: boolean }`

See the demo:

<<< ../../components/en/styles-and-classes/ClassExample.styles.css{css:line-numbers}
<<< ../../components/en/styles-and-classes/ClassExample.tsx{5,10,11,14-17,22-25 tsx:line-numbers}
<Demo :is="ClassExample" />

::: warning
Raw import of `.css` files enables your styles globally.  

For scoped styles see next example with `css modules` syntax.
:::
## Using Css Modules

Here's the same example, but using `css modules` syntax.

<<< ../../components/en/styles-and-classes/CssModuleExample.module.css{css:line-numbers}
<<< ../../components/en/styles-and-classes/CssModuleExample.tsx{5,10,11,14-17,22-25 tsx:line-numbers}
<Demo :is="CssModuleExample" />
