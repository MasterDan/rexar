import { container, useClass } from '@rexar/di';
import { IComponentRendererResolver } from './@types/IComponentRendererResolver';
import { IHtmlRenderer } from './@types/IHtmlRenderer';
import { AppRendererHtml } from './app-renderer-html';
import { ComponentRendererHtml } from './component-renderer-html';
import { ComponentRendererResolver } from './component-renderer-resolver';

export const resolveAplicationRenderer = (() => {
  container
    .createToken(
      'IComponentRendererResolver',
      useClass<IComponentRendererResolver>(),
    )
    .provide(ComponentRendererResolver);

  container
    .createToken(
      'IHtmlRenderer',
      useClass<IHtmlRenderer>((c) => [c.resolve('IComponentRendererResolver')]),
    )
    .provide(ComponentRendererHtml);

  const appRendererToken = container.createToken(
    'AppRendererHtml',
    useClass<AppRendererHtml>((c) => [c.resolve('IHtmlRenderer')]),
  );
  appRendererToken.provide(AppRendererHtml);

  return () => appRendererToken.resolve();
})();
