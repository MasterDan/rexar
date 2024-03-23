# Dynamic Components

<script setup>
import Demo from '../../components/tools/Demo.vue'
import { DynamicExample } from '../../components/en/dynamic/DynamicExample.tsx'
</script>

<<< ../../components/en/dynamic/DynamicExample.tsx{4,6,10 tsx:line-numbers}
<Demo :is="DynamicExample" align-start />