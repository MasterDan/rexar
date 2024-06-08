# Getting HTML Elements

<script setup>
import Demo from '../../components/tools/Demo.vue'
import { Counter } from '../../components/en/elements/Counter.tsx'
import { CaptureExample } from '../../components/en/elements/CaptureExample.tsx'
import { CustomTags } from '../../components/en/elements/CustomTags.tsx'

</script>

## Using JSX and variables

Our Jsx implementation has no intermediate layers. So you are able to create any element, put it into variable, and work with this variable.
For some cases this may be enough.

Here is example of counter component using almost only DOM api.

<<< ../../components/en/elements/Counter.tsx{tsx:line-numbers}

<Demo :is="Counter" />

## Using Capture component

Another way is using special `Capture` component. Put content with single element root inside it, and uou will receive Element inside `el$` prop.

See the example.

<<< ../../components/en/elements/CaptureExample.tsx{tsx:line-numbers}

<Demo :is="CaptureExample" />

## Custom Tags

<<< ../../components/en/elements/CustomTags.tsx{tsx:line-numbers}
<Demo align-start :is="CustomTags" />

