# Passing Props

<script setup>
import Demo from '../../components/tools/Demo.vue'
import { TextInput } from '../../components/en/props/TextInput.tsx'
import { ParentComponent } from '../../components/en/props/ParentComponent.tsx'
</script>

## Example

<<< ../../components/en/props/TextInput.tsx{tsx:line-numbers}
<<< ../../components/en/props/ParentComponent.tsx{tsx:line-numbers}
<Demo align-start :is="ParentComponent" />