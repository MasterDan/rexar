import { CustomTemplateComponent } from '@core/components/builtIn/custom/custom-template-component';
import { list } from '@core/components/builtIn/list.component';
import { hookScope } from '@core/tools/hooks/hooks';
import { firstValueFrom, from, Observable, of, switchMap, tap } from 'rxjs';
import { injectable, injectAll, registry } from 'tsyringe';
import { AnyComponent } from '../../@types/any-component';
import { IBinding } from '../../@types/binding-target';
import { IHtmlRenderer } from '../../@types/IHtmlRenderer';
import { HtmlRendererBase } from '../../base/html-renderer-base';
import { RefStore } from '../../ref-store/ref-store';
import { resolveRenderer } from '../../tools';
import { IHookHandler } from './hook-handlers/base/hook-handler';
import { ConditionalHookHandler } from './hook-handlers/conditional-hook-handler';
import { ElementReferenceHookHandler } from './hook-handlers/element-reference-hook-handler';
import { MountComponentHookHandler } from './hook-handlers/mount-component-hook-handler';
import { PickTemplateHookHandler } from './hook-handlers/pick-template-hook-handler';

const hookHandlerToken = 'IHookHandler';

@injectable()
@registry([
  { token: hookHandlerToken, useClass: ElementReferenceHookHandler },
  { token: hookHandlerToken, useClass: MountComponentHookHandler },
  { token: hookHandlerToken, useClass: ConditionalHookHandler },
  { token: hookHandlerToken, useClass: PickTemplateHookHandler },
])
export class CustomRendererHtml extends HtmlRendererBase {
  private renderer: IHtmlRenderer | undefined;

  constructor(
    private refStore: RefStore,
    @injectAll(hookHandlerToken) private hookHandlers: IHookHandler[],
  ) {
    super();
  }

  async unmount(): Promise<void> {
    if (this.renderer == null) {
      throw new Error('Cannot unmout component that has not been rendered');
    }
    await this.renderer.unmount();
  }

  renderInto(target: IBinding): Observable<IBinding | undefined> {
    if (!(this.component instanceof CustomTemplateComponent)) {
      throw new Error('Component should be custom');
    }
    const component = this.component as CustomTemplateComponent;
    this.refStore.beginScope(this.component.type);

    const { track$, end } = hookScope.beginScope();
    this.hookHandlers.forEach((handler) => {
      handler.register(track$);
    });
    component.setup();
    end();

    const renderAsync = async (): Promise<Observable<IBinding | undefined>> => {
      let templateToRender!: AnyComponent[];
      const resolvedTemplate = await firstValueFrom(component.template);
      if (typeof resolvedTemplate === 'string') {
        const { parseHtml } = await import('@core/parsers/html');
        const templates = await parseHtml(resolvedTemplate);
        this.refStore.setInnerTemplates(templates.inner);
        templateToRender = templates.default;
      } else {
        templateToRender = Array.isArray(resolvedTemplate)
          ? resolvedTemplate
          : (() => {
              this.refStore.setInnerTemplates(resolvedTemplate.inner);
              return resolvedTemplate.default;
            })();
      }

      if (templateToRender.length === 1) {
        const [componentTemplate] = templateToRender;
        const renderer = resolveRenderer(componentTemplate, target);
        this.renderer = renderer;
        await renderer.render();
        return renderer.nextTarget$;
      }
      if (templateToRender.length > 1) {
        const componentTemplate = list(templateToRender);
        const renderer = resolveRenderer(componentTemplate, target);
        this.renderer = renderer;
        await renderer.render();
        return renderer.nextTarget$;
      }
      return of(undefined);
    };
    return from(renderAsync()).pipe(
      switchMap((x) => x),
      tap(() => {
        this.refStore.endScope();
      }),
    );
  }
}
