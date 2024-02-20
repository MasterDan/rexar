# Conditional Rendering

<script setup >
import Demo from '../../components/tools/Demo.vue'
import { ifElseExample } from '../../components/en/conditional-rendering/IfElseExample.tsx'
import { IfElseExampleAdvanced } from '../../components/en/conditional-rendering/IfElseExampleAdvanced.tsx'
import { SwitchCaseExample } from '../../components/en/conditional-rendering/SwitchCaseExample.tsx'
</script>

## Simple Example

<<< ../../components/en/conditional-rendering/IfElseExample.tsx{8,12,13 tsx:line-numbers}
<Demo :is="ifElseExample" />

## Advanced Example

<<< ../../components/en/conditional-rendering/IfElseExampleAdvanced.tsx{11,12,22-24 tsx:line-numbers}
<Demo  :is="IfElseExampleAdvanced" />

## Switch/Case alternative

<<< ../../components/en/conditional-rendering/SwitchCaseExample.tsx{tsx:line-numbers}
<Demo  :is="SwitchCaseExample" />