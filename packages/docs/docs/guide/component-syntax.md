# Component syntax


<script setup>
import Demo from '../../components/tools/Demo.vue'
import { Timer } from '../../components/en/getting-started/Timer.tsx'

</script>



## RxJS Observable example

Here is example of using `RxJs observable` inside `jsx` markup.  
For this example we are using [timer](https://rxjs.dev/api/index/function/timer) and a few operators to beautify output.

<<< ../../components/en/getting-started/Timer.tsx{tsx:line-numbers}
<Demo :is="Timer" />