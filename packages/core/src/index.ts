export * from '@rexar/reactivity';
export * from '@rexar/jsx';
export {
  defineComponent,
  render,
  type ComponentRenderFunc,
  type RenderedController,
} from './component';
export {
  useDefaultValues,
  useClasses,
  useEvent,
  type EventTrigger,
} from './component/tools';
export { onRendered, onMounted, onBeforeDestroy, onDestroyed } from './scope';
export { Comment } from './built-in-components/comment';
export { useDynamic } from './built-in-components/dynamic';
export { useIf, Show } from './built-in-components/if-else';
export { useFor } from './built-in-components/for-each';
export { useSwitch } from './built-in-components/switch-case';
