# Dynamic Components

<script setup>
import Demo from '../../components/tools/Demo.vue'
import { DynamicExample } from '../../components/en/dynamic/DynamicExample.tsx'
</script>

For displaying dynamic content we are using `useDynamic` helper function.
This function takes `() => JSX.Element` as argument to display initial content  
and returns `[ Component, setContent ]` array where
  * `Component`: component that displays dynamic content
  * `setContent`: `(content: () => JSX.Element ) => void` - function, that sets another content if you need to.

See the example:

<<< ../../components/en/dynamic/DynamicExample.tsx{4,6,10 tsx:line-numbers}
<Demo :is="DynamicExample" align-start />