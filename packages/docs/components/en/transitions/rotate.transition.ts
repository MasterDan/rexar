import {
  AnimationKeysOf,
  createTransition,
  createTransitionComponent,
} from '@rexar/core';
import transitions from './rotate.transition.module.css';

// our transition
export const transitionRotate = createTransition()
  .withState('rotated', transitions.rotated)
  .withTransition(
    /**
     * '*' symbol means any state
     *
     *  transitions with `*` will be taken
     * if direct transition between states was not found
     *
     *  reverse flag means that same class
     * will also be provided as transition from '*' to 'rotated' state
     */
    { from: 'rotated', to: '*', reverse: true },
    transitions['transition-rotate']
  );

// Keys will be 'default' | 'void' | 'rotated'
export type RotateKeys = AnimationKeysOf<typeof transitionRotate>;

// And finally we creating our component
export const TransitionRotate = createTransitionComponent(transitionRotate);
