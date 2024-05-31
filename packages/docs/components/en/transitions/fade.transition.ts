import {
  AnimationKeysOf,
  createTransition,
  createTransitionComponent,
} from '@rexar/core';
import transitions from './fade.transition.module.css';

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

export const TransitionFade = createTransitionComponent(transitionFade);
