# Component Syntax


<script setup>
import Demo from '../../components/tools/Demo.vue'
import { Timer } from '../../components/en/component-syntax/Timer.tsx'
import { Numbers } from '../../components/en/component-syntax/Numbers.tsx' 
import { NumbersAlt } from '../../components/en/component-syntax/NumbersAlt.tsx' 
import { Strings } from '../../components/en/component-syntax/Strings.tsx' 
import { Boolean } from '../../components/en/component-syntax/Boolean.tsx' 
import { ObjectExample } from '../../components/en/component-syntax/Object.tsx' 

</script>

## RxJS Observable example

Here is example of using `RxJs observable` inside `jsx` markup.  
For this example we are using [timer](https://rxjs.dev/api/index/function/timer) and a few operators to beautify output.

<<< ../../components/en/component-syntax/Timer.tsx{tsx:line-numbers}
<Demo :is="Timer" />

## Numbers

<<< ../../components/en/component-syntax/Numbers.tsx{tsx:line-numbers}
<Demo align-start :is="Numbers" />

## Same example, using RxJs BehaviorSubject

<<< ../../components/en/component-syntax/NumbersAlt.tsx{tsx:line-numbers}
<Demo align-start :is="NumbersAlt" />

## Strings

<<< ../../components/en/component-syntax/Strings.tsx{tsx:line-numbers}
<Demo align-start :is="Strings" />

## Boolean

<<< ../../components/en/component-syntax/Boolean.tsx{tsx:line-numbers}
<Demo align-start :is="Boolean" />

## Objects

<<< ../../components/en/component-syntax/Object.tsx{tsx:line-numbers}
<Demo align-start :is="ObjectExample" />


