import { defineComponent } from '@rexar/core';

// @ts-expect-error import template
import template from 'bundle-text:./inner.component.html';

export const inner = defineComponent({ template });
