# Passing Props

<script setup>
import Demo from '../../components/tools/Demo.vue'
import { ParentComponent } from '../../components/en/props/ParentComponent.tsx'
import { ParentComponent as ParentComponent2 } from '../../components/en/props/ParentComponent2.tsx'
import { CardExample } from '../../components/en/props/CardExample.tsx'
import { CardExample as CardExample2 } from '../../components/en/props/CardExample2.tsx'
</script>

## First Example

Let's create `TextInput` component that accepts `label` and `value$` props.

For passing props we are using `props` object parameter in our component declaration function.
In example this object is already deconstructed.  
Here we're defining reactive `value$` and non-reactive `label` props.

::: info
Don't worry about mutating `value$`'s value from inside component.  
This move will **not** trigger full component rerendering.  
Our components are rendering only once, as it's being said in the beginning of this guide.

Triggering `Ref` is just triggering `Ref`. Even in props.
:::

<<< ../../components/en/props/TextInput.tsx{4-6,10,14-17 tsx:line-numbers}

Let's use our input component:

<<< ../../components/en/props/ParentComponent.tsx{2,9,10 tsx:line-numbers}
<Demo align-start :is="ParentComponent" />

## Using default values

Let's add in out `TextInput` component prop `id` and make it optional.  
What if we want to use default value of `id` in case it's not being provided by parent component.

For this purpose we are using `useDefaultValues` function. Pay attention, that we are providing `function`, that creates default value (id in our case), not value itself.  
See the example:

<<< ../../components/en/props/TextInput2.tsx{12,14-16 tsx:line-numbers}

Let's provide id in one of our `TextInput` components:

<<< ../../components/en/props/ParentComponent2.tsx{9 tsx:line-numbers}
<Demo align-start :is="ParentComponent2" />

## Providing content

For providing content inside component we are using special property `children`.  
Every component has this property by default so you don't need to define it explicitly.

Let's create simple `Card` component:

<<< ../../components/en/props/Card.tsx{3,11 tsx:line-numbers}

And let's use it:

<<< ../../components/en/props/CardExample.tsx{tsx:line-numbers}
<Demo :is="CardExample" />

## Additional content

For additional content you have to specify properties by yourself.  
Let's create `Card` with `header` and `footer` props: 

<<< ../../components/en/props/Card2.tsx{4-6,21,23,31 tsx:line-numbers}
<<< ../../components/en/props/CardExample2.tsx{5 tsx:line-numbers}
<Demo :is="CardExample2" />