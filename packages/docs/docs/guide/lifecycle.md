# Component lifecycle

<script setup>
import Demo from '../../components/tools/Demo.vue'
import { LifecycleLog } from '../../components/en/lifecycle/lifecycle-log.tsx'

</script>

<<< ../../components/en/lifecycle/lifecycle.tsx{tsx:line-numbers}
<<< ../../components/en/lifecycle/lifecycle-log.tsx{tsx:line-numbers}
<Demo :is="LifecycleLog" />
