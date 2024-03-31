import { defineComponent } from '@rexar/core';

export const Card = defineComponent(({ children }) => (
  <div
    style={{
      padding: '1rem',
      borderRadius: '1rem',
      backgroundColor: 'rgba(235, 161, 52, 0.25)',
    }}
  >
    {children}
  </div>
));
