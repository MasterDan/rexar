import { container, delay, Lifecycle } from 'tsyringe';
import { AppRendererHtml } from './app-renderer-html';
import { ComponentRendererHtml } from './component-renderer-html';
import { ComponentRendererResolver } from './component-renderer-resolver';

const setup = () => {
  container.register(
    'IComponentRendererResolver',
    {
      useToken: delay(() => ComponentRendererResolver),
    },
    { lifecycle: Lifecycle.Singleton },
  );

  container.register('IHtmlRenderer', {
    useToken: delay(() => ComponentRendererHtml),
  });

  return () => container.resolve(AppRendererHtml);
};

export const getAppRenderer = setup();
