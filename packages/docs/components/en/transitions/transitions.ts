import {
  AnimationKeysOf,
  createTransition,
  createTransitionComponent,
} from '@rexar/core';
import transitions from './transitions.module.css';

const transitionFade = createTransition()
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

const transitionRotate = createTransition()
  .withState('rotated', transitions.rotated)
  .withTransition(
    { from: 'rotated', to: '*', reverse: true },
    transitions['transition-rotate']
  );

export type RotateKeys = AnimationKeysOf<typeof transitionRotate>;

export const TransitionFade = createTransitionComponent(transitionFade);

export const TransitionRotate = createTransitionComponent(transitionRotate);

export const TransitionMixed = createTransitionComponent({
  fade: transitionFade,
  rotate: transitionRotate,
});
