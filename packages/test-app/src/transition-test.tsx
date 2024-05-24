import { createTransition } from '@rexar/core';

export const TransitionFade = createTransition()
  .setState('default')
  .withStyle({
    opacity: '1',
  })
  .setState('void')
  .withStyle({ opacity: '1' })
  .setTransition.from('void')
  .to('default')
  .withStyle({
    transition: 'opacity 0.3s ease-in-out',
  })
  .setTransition.from('default')
  .to('void')
  .withStyle({
    transition: 'opacity 0.3s ease-in-out',
  });

