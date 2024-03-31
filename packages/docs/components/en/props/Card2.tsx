import { defineComponent } from '@rexar/core';

export const Card = defineComponent<{
  header: JSX.Element;
  footer: JSX.Element;
}>(({ children, header, footer }) => (
  <div
    style={{
      padding: '1rem',
      borderRadius: '1rem',
      backgroundColor: 'rgba(235, 161, 52, 0.25)',
    }}
  >
    <div
      style={{
        borderBottom: '1px solid',
        marginBottom: '0.5rem',
        paddingBottom: '0.5rem',
      }}
    >
      {header}
    </div>
    {children}
    <div
      style={{
        borderTop: '1px solid',
        marginTop: '0.5rem',
        paddingTop: '0.5rem',
      }}
    >
      {footer}
    </div>
  </div>
));
