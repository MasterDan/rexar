# Computed properties

<script setup>
import Demo from '../../components/tools/Demo.vue'
import { ComputedExample } from '../../components/en/reactivity/computed/ComputedExample.tsx'
</script>

## `Computed`

Just use arrow function and it will automatically subscribe on all [Refs](../guide/ref.md#ref) inside it.  
Only `ref`s - not any `observables`.

Examples of `computed` usage are also available on [component syntax](../guide/component-syntax.md) page.
* where computed is [reactive](../guide/component-syntax.md#numbers)
* and where is [not](../guide/component-syntax.md#same-example-using-rxjs-behaviorsubject)

Computed can also be writable. Just pass setter function as second argument.  
See the example:

<<< ../../components/en/reactivity/computed/ComputedExample.tsx{7,9-16 tsx:line-numbers}
<Demo :is="ComputedExample" />
