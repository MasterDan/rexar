# List rendering

<script setup >
import Demo from '../../components/tools/Demo.vue'
import { List } from '../../components/en/list-rendering/List.tsx'
import { List as ListAdvanced } from '../../components/en/list-rendering/ListAdvanced.tsx'
</script>

## Simple List

<<< ../../components/en/list-rendering/List.tsx{tsx:line-numbers}

<Demo  :is="List" />

## Advanced List

<<< ../../components/en/list-rendering/ListAdvanced.tsx{tsx:line-numbers}

<Demo  :is="ListAdvanced" />
