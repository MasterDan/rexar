import {
  AnimationKeysOf,
  createTransition,
  createTransitionComponent,
} from '@rexar/core';
import transitions from './transitions.module.css';
// fade transition
export const transitionFade = createTransition()
  .withState('default', transitions['opacity-one'])
  .withState('void', transitions['opacity-zero'])
  .withTransition(
    { from: 'void', to: 'default' },
    transitions['transition-opacity-in']
  )
  .withTransition(
    { from: 'default', to: 'void' },
    transitions['transition-opacity-out']
  );

export type FadeKeys = AnimationKeysOf<typeof transitionFade>;
// rotate transition
export const transitionRotate = createTransition()
  .withState('rotated', transitions.rotated)
  .withTransition(
    { from: 'rotated', to: '*', reverse: true },
    transitions['transition-rotate']
  );

export type RotateKeys = AnimationKeysOf<typeof transitionRotate>;
// component with both fade and rotate transitions
export const TransitionMixed = createTransitionComponent({
  fade: transitionFade,
  rotate: transitionRotate,
});
