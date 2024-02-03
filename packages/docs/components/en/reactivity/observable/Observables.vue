<template src="./Observables.template.html"></template>
<script setup>
import { onMounted } from 'vue';
import { setup } from './Observables.setup';

onMounted(() => {
  setup();
});
</script>
