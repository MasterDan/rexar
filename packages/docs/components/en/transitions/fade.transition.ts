import {
  AnimationKeysOf,
  createTransition,
  createTransitionComponent,
} from '@rexar/core';
import transitions from './fade.transition.module.css';

// creating transition
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

// Possible States of our transition.
// For "transitionFade" it Will be 'default' | 'void'
export type FadeKeys = AnimationKeysOf<typeof transitionFade>;

// This component will attach our transition to html element
export const TransitionFade = createTransitionComponent(transitionFade);
