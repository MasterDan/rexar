import {
  AnimationKeysOf,
  createTransition,
  createTransitionComponent,
} from '@rexar/core';
import transitions from './transitions.module.css';

export const transitionRotate = createTransition()
  .withState('rotated', transitions.rotated)
  .withTransition(
    { from: 'rotated', to: '*', reverse: true },
    transitions['transition-rotate']
  );

export type RotateKeys = AnimationKeysOf<typeof transitionRotate>;

export const TransitionRotate = createTransitionComponent(transitionRotate);
