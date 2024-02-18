<template>
  <div class="demo-container">
    <div class="app" ref="appRef"></div>
    <button @click="reset" :disabled="appController == null" id="reset-button">
      reset
    </button>
  </div>
</template>
<script lang="ts" setup>
import { ref, PropType, onMounted } from 'vue';
import { ComponentRenderFunc, render, RenderedController } from '@rexar/core';

const props = defineProps({
  is: {
    type: Function as PropType<ComponentRenderFunc>,
    required: true,
  },
});

const appRef = ref();

const appController = ref<RenderedController>();

function renderDemo() {
  if (appRef.value) {
    appController.value = render(props.is).into(appRef.value);
  }
}

onMounted(() => {
  renderDemo();
});

function reset() {
  if (appController.value) {
    appController.value.remove();
    appController.value = undefined;
    renderDemo();
  }
}
</script>
<style lang="scss">
.demo-container {
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  gap: 2rem;
  justify-content: space-between;
  align-items: center;
  .app {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  #reset-button {
    align-self: flex-start;
  }

  background-color: var(--vp-code-block-bg) !important;
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
