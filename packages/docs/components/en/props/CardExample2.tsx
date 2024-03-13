import { defineComponent, h, fragment } from '@rexar/core';
import { Card } from './Card2';

export const CardExample = defineComponent(() => (
  <Card header={<>Card Header</>} footer={<>Card footer</>}>
    <span>Awesome card content</span>
  </Card>
));
