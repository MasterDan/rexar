import { CustomTemplateComponent } from '@core/components/builtIn/custom/custom-template.component';
import { list } from '@core/components/builtIn/list.component';
import { hookScope } from '@core/tools/hooks/hooks';
import { ScopedLogger } from '@rexar/logger';
import { firstValueFrom, from, Observable, of, switchMap, tap } from 'rxjs';
import { AnyComponent } from '../../@types/any-component';
import { IBinding } from '../../@types/binding-target';
import { IHtmlRenderer } from '../../@types/IHtmlRenderer';
import { HtmlRendererBase } from '../../base/html-renderer-base';
import { ComponentLifecycle } from '../../base/lifecycle';
import { RefStore } from '../../ref-store/ref-store';
import { resolveRenderer } from '../../tools';
import { IHookHandler } from './hook-handlers/base/hook-handler';

export class CustomRendererHtml extends HtmlRendererBase {
  private renderer: IHtmlRenderer | undefined;

  private $logger: ScopedLogger | undefined;

  private get logger() {
    if (this.$logger == null) {
      throw new Error('Logger for custom component not been set');
    }
    return this.$logger;
  }

  constructor(
    private refStore: RefStore,
    private hookHandlers: IHookHandler[],
  ) {
    super();
  }

  async unmount(): Promise<void> {
    if (this.renderer == null) {
      throw new Error('Cannot unmout component that has not been rendered');
    }

    this.lifecycle$.value = ComponentLifecycle.BeforeUnmount;
    await this.renderer.unmount();
    this.lifecycle$.value = ComponentLifecycle.Unmounted;
    this.logger.debug('Component is unmounted');
  }

  renderInto(target: IBinding): Observable<IBinding | undefined> {
    this.$logger = ScopedLogger.createScope.sibling(
      this.component.id ?? 'Custom Component',
      {
        captureNext: true,
      },
    );
    this.lifecycle$.value = ComponentLifecycle.BeforeRender;
    if (!(this.component instanceof CustomTemplateComponent)) {
      throw new Error('Component should be custom');
    }
    const component = this.component as CustomTemplateComponent;
    this.refStore.beginScope(this.component.type, this.lifecycle$);

    const { track$, end } = hookScope.beginScope();
    this.hookHandlers.forEach((handler) => {
      handler.register(track$);
    });
    component.setup();
    end();

    const renderAsync = async (): Promise<Observable<IBinding | undefined>> => {
      const resolvedTemplate = await firstValueFrom(component.template);
      this.refStore.setInnerTemplates(resolvedTemplate.inner);
      const templateToRender: AnyComponent[] = resolvedTemplate.default;

      if (templateToRender.length === 1) {
        const [componentTemplate] = templateToRender;
        const renderer = resolveRenderer(componentTemplate, target);
        renderer.subscribeParentLifecycle(this.lifecycle$);
        this.renderer = renderer;
        await renderer.render();
        this.lifecycle$.value = ComponentLifecycle.Rendered;
        return renderer.nextTarget$;
      }
      if (templateToRender.length > 1) {
        const componentTemplate = list(templateToRender);
        const renderer = resolveRenderer(componentTemplate, target);
        renderer.subscribeParentLifecycle(this.lifecycle$);
        this.renderer = renderer;
        await renderer.render();
        this.lifecycle$.value = ComponentLifecycle.Rendered;
        return renderer.nextTarget$;
      }
      this.lifecycle$.value = ComponentLifecycle.Rendered;
      return of(undefined);
    };
    return from(renderAsync()).pipe(
      switchMap((x) => x),
      tap(() => {
        ScopedLogger.endScope();
        this.refStore.endScope();
      }),
    );
  }
}
