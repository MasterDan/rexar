<template>
  <div class="demo-container">
    <slot v-if="showExample"></slot>
    <div v-else>loading...</div>
  </div>
</template>
<script lang="ts" setup>
import { watch, ref } from 'vue';

const showExample = ref(false);
watch(
  showExample,
  (show) => {
    if (!show) {
      setTimeout(() => {
        showExample.value = true;
      }, 5000);
    }
  },
  {
    immediate: true,
  },
);
</script>
<style lang="scss">
.demo-container {
  padding: 1rem 0;
  border-radius: 8px;
  button {
    border-color: var(--vp-button-alt-border);
    color: var(--vp-button-alt-text);
    background-color: var(--vp-button-alt-bg);
    display: inline-block;
    border: 1px solid transparent;
    text-align: center;
    font-weight: 600;
    white-space: nowrap;
    transition: color 0.25s, border-color 0.25s, background-color 0.25s;
    border-radius: 20px;
    padding: 0 20px;
    line-height: 38px;
    font-size: 14px;
    &:active {
      border-color: var(--vp-button-alt-active-border);
      color: var(--vp-button-alt-active-text);
      background-color: var(--vp-button-alt-active-bg);
    }
    &:hover {
      border-color: var(--vp-button-alt-hover-border);
      color: var(--vp-button-alt-hover-text);
      background-color: var(--vp-button-alt-hover-bg);
    }
  }
}
</style>
