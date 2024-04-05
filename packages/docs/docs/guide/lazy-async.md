# Lazy Rendering

<script setup>
import Demo from '../../components/tools/Demo.vue'
import { LazyExample } from '../../components/en/lazy-async/LazyExample.tsx'
</script>

For lazy loading and splitting chunks we are using `defineLazyComponent` function.
We can also provide minimal `timeout`  and `fallback` for loading placeholder.

See the example:

<<< ../../components/en/lazy-async/Message.tsx{tsx:line-numbers}
<<< ../../components/en/lazy-async/LazyExample.tsx{4-6,8-14,28,30 tsx:line-numbers}

<Demo :is="LazyExample" align-start />