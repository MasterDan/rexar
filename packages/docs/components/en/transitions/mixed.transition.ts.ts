import { createTransitionComponent } from '@rexar/core';
import { transitionFade } from './fade.transition';
import { transitionRotate } from './rotate.transition';

export const TransitionMixed = createTransitionComponent({
  fade: transitionFade,
  rotate: transitionRotate,
});
