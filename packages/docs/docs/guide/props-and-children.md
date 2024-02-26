# Passing Props

<script setup>
import Demo from '../../components/tools/Demo.vue'
import { TextInput } from '../../components/en/props/TextInput.tsx'
import { TextInput as TextInput2 } from '../../components/en/props/TextInput2.tsx'
import { ParentComponent } from '../../components/en/props/ParentComponent.tsx'
import { ParentComponent as ParentComponent2 } from '../../components/en/props/ParentComponent2.tsx'
</script>

## Example

<<< ../../components/en/props/TextInput.tsx{tsx:line-numbers}
<<< ../../components/en/props/ParentComponent.tsx{tsx:line-numbers}
<Demo align-start :is="ParentComponent" />

## Using default values

<<< ../../components/en/props/TextInput2.tsx{18-20 tsx:line-numbers}
<<< ../../components/en/props/ParentComponent2.tsx{9 tsx:line-numbers}
<Demo align-start :is="ParentComponent2" />