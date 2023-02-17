import { HtmlRendererBase } from '../base/html-renderer-base';
import { AnyComponent } from './any-component';

export type RendererFactory = (component: AnyComponent) => HtmlRendererBase;
