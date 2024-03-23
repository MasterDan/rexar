# Component lifecycle

<script setup>
import Demo from '../../components/tools/Demo.vue'
import { LifecycleLog } from '../../components/en/lifecycle/lifecycle-log.tsx'

</script>

Each Rexar component goes through series of steps during it's lifecycle.  
Rexar provides series of functions, called `lifecycle Hooks` that gives user opportunity to execute custom logic at different stages.  
Each function returns an `observable`, which allows user subscribe on them or use in reactive expressions.

These hooks are
    * `onRendered` - component created it's own markup, but it may be not attached to DOM tree yet
    * `onMounted` - component rendered and it's markup attached to DOM tree.
    * `onBeforeDestroy` - component is going to be destroyed, but still exists
    * `onDestroyed` - component is destroyed, it's markup no longer exists

To illustrate this behavior let's create component, thad displays and emits it's own status:

<<< ../../components/en/lifecycle/lifecycle.tsx{21-32 tsx:line-numbers}

Then let's create component, that will catch status changes and write it inside log with little delay.  
See the example. Press the button and see the updates in log.

<<< ../../components/en/lifecycle/lifecycle-log.tsx{tsx:line-numbers}
<Demo :is="LifecycleLog" />
