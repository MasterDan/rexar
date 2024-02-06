<template src="./CounterApp.template.html"></template>
<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  import('./CounterApp.setup');
});
</script>
